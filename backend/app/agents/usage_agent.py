"""
Usage Pattern Analysis Agent (Agent 1)

Detects abnormal fingerprint usage patterns:
- High frequency usage (>5 times in 24 hours)
- Cross-case reuse (same fingerprint, different cases)
- Reactivation (dormant >30 days, suddenly active)

Integrates with the database to track and analyze usage history.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

from app.database import (
    get_fingerprint_hash,
    record_usage,
    get_usage_history,
    get_usage_stats
)


class UsageStatus(str, Enum):
    """Usage pattern status."""
    NORMAL = "NORMAL"
    SUSPICIOUS = "SUSPICIOUS"


@dataclass
class UsageAnalysis:
    """Result of usage pattern analysis."""
    usage_score: float          # 0-1 (1 = normal, 0 = highly suspicious)
    usage_status: UsageStatus
    anomalies: List[str]        # List of detected anomalies
    total_uses: int
    unique_cases: int
    uses_24h: int
    first_seen: Optional[str]
    last_seen: Optional[str]
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            "usage_score": round(self.usage_score, 2),
            "usage_status": self.usage_status.value,
            "anomalies": self.anomalies,
            "total_uses": self.total_uses,
            "unique_cases": self.unique_cases,
            "uses_24h": self.uses_24h,
            "first_seen": self.first_seen,
            "last_seen": self.last_seen
        }


class UsageAgent:
    """
    Agent 1: Fingerprint Usage Pattern Analysis
    
    Analyzes fingerprint usage history to detect suspicious patterns
    that may indicate tampering, planting, or unauthorized reuse.
    """
    
    # Thresholds for anomaly detection
    HIGH_FREQUENCY_THRESHOLD = 5      # Uses in 24 hours
    CROSS_CASE_THRESHOLD = 3          # Different cases using same fingerprint
    DORMANCY_DAYS = 30                # Days of inactivity before "reactivation"
    
    def __init__(self):
        """Initialize the usage agent."""
        pass
    
    def record_and_analyze(
        self,
        image_bytes: bytes,
        case_id: Optional[str] = None,
        sector: str = "unknown",
        liveness_score: Optional[float] = None,
        risk_level: Optional[str] = None
    ) -> UsageAnalysis:
        """
        Record usage and analyze patterns.
        
        Args:
            image_bytes: Raw fingerprint image bytes
            case_id: Case or record identifier
            sector: Usage sector (forensic/hospital)
            liveness_score: Score from Agent 2
            risk_level: Risk level from risk engine
            
        Returns:
            UsageAnalysis with pattern detection results
        """
        # Generate fingerprint hash
        fp_hash = get_fingerprint_hash(image_bytes)
        
        # Get stats BEFORE recording new usage
        stats = get_usage_stats(fp_hash)
        history = get_usage_history(fp_hash, days=90)
        
        # Analyze patterns
        analysis = self._analyze_patterns(fp_hash, case_id, stats, history)
        
        # Record the new usage
        record_usage(
            fingerprint_hash=fp_hash,
            case_id=case_id,
            sector=sector,
            liveness_score=liveness_score,
            risk_level=risk_level
        )
        
        return analysis
    
    def _analyze_patterns(
        self,
        fp_hash: str,
        current_case_id: Optional[str],
        stats: Dict,
        history: List[Dict]
    ) -> UsageAnalysis:
        """
        Analyze usage patterns and detect anomalies.
        
        Args:
            fp_hash: Fingerprint hash
            current_case_id: Current case ID
            stats: Aggregate usage statistics
            history: Recent usage history
            
        Returns:
            UsageAnalysis with detected patterns
        """
        anomalies = []
        score_penalties = 0.0
        
        # Check 1: High frequency usage
        uses_24h = stats.get('uses_24h', 0)
        if uses_24h >= self.HIGH_FREQUENCY_THRESHOLD:
            anomalies.append(
                f"High frequency: {uses_24h} uses in last 24 hours"
            )
            score_penalties += 0.3
        
        # Check 2: Cross-case reuse
        unique_cases = stats.get('unique_cases', 0) or 0
        
        # Check if current case is new
        existing_cases = set()
        for record in history:
            if record.get('case_id'):
                existing_cases.add(record['case_id'])
        
        if current_case_id and current_case_id not in existing_cases and len(existing_cases) > 0:
            anomalies.append(
                f"Cross-case reuse: Fingerprint used in {len(existing_cases)} previous case(s), now appearing in new case"
            )
            score_penalties += 0.4
        elif unique_cases >= self.CROSS_CASE_THRESHOLD:
            anomalies.append(
                f"Multi-case usage: Same fingerprint linked to {unique_cases} different cases"
            )
            score_penalties += 0.2
        
        # Check 3: Reactivation after dormancy
        if stats.get('last_seen') and stats.get('total_uses', 0) > 0:
            try:
                last_seen = datetime.fromisoformat(stats['last_seen'].replace('Z', '+00:00'))
                days_since = (datetime.now() - last_seen.replace(tzinfo=None)).days
                
                if days_since >= self.DORMANCY_DAYS:
                    anomalies.append(
                        f"Reactivation: Fingerprint dormant for {days_since} days, now active again"
                    )
                    score_penalties += 0.3
            except (ValueError, TypeError):
                pass
        
        # Calculate final score
        usage_score = max(0.0, 1.0 - score_penalties)
        
        # Determine status
        if anomalies:
            status = UsageStatus.SUSPICIOUS
        else:
            status = UsageStatus.NORMAL
        
        return UsageAnalysis(
            usage_score=usage_score,
            usage_status=status,
            anomalies=anomalies,
            total_uses=stats.get('total_uses', 0) or 0,
            unique_cases=unique_cases,
            uses_24h=uses_24h,
            first_seen=stats.get('first_seen'),
            last_seen=stats.get('last_seen')
        )
    
    def get_fingerprint_history(self, image_bytes: bytes) -> List[Dict]:
        """
        Get usage history for a fingerprint.
        
        Args:
            image_bytes: Raw fingerprint image bytes
            
        Returns:
            List of usage records
        """
        fp_hash = get_fingerprint_hash(image_bytes)
        return get_usage_history(fp_hash)
