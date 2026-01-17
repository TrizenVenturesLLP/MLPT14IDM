"""
Risk Engine (Agent 3)

Combines liveness detection (Agent 2) and usage pattern analysis (Agent 1)
into a final risk assessment.

SCORING:
    - Weighted combination: (liveness × 0.6) + (usage × 0.4)
    - Both components contribute to final risk level
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import Tuple, List, Optional


class RiskLevel(str, Enum):
    """Risk level classification."""
    NORMAL = "NORMAL"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH = "HIGH"


@dataclass
class RiskAssessment:
    """
    Risk assessment result combining Agent 1 and Agent 2.
    
    Attributes:
        liveness_score: Score from Agent 2 (liveness detection)
        usage_score: Score from Agent 1 (usage pattern analysis)
        combined_score: Weighted combination of both scores
        risk_level: Final classified risk level
        explanation: Human-readable explanation
        anomalies: List of detected usage anomalies
    """
    liveness_score: float
    usage_score: float
    combined_score: float
    risk_level: RiskLevel
    explanation: str
    anomalies: List[str] = field(default_factory=list)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON response."""
        result = {
            "liveness_score": round(self.liveness_score, 2),
            "risk_level": self.risk_level.value,
            "explanation": self.explanation
        }
        
        # Include extended info if available
        if self.usage_score is not None:
            result["usage_score"] = round(self.usage_score, 2)
            result["combined_score"] = round(self.combined_score, 2)
        
        if self.anomalies:
            result["anomalies"] = self.anomalies
            
        return result


class RiskEngine:
    """
    Risk Engine: Combines Agent 1 + Agent 2 scores into final assessment.
    
    Weighting:
        - Liveness (Agent 2): 60%
        - Usage patterns (Agent 1): 40%
    
    Thresholds (applied to combined score):
        - HIGH: combined_score < 0.4
        - SUSPICIOUS: 0.4 <= combined_score < 0.7
        - NORMAL: combined_score >= 0.7
    """
    
    # Weights for combining scores
    LIVENESS_WEIGHT: float = 0.6
    USAGE_WEIGHT: float = 0.4
    
    # Threshold configuration
    HIGH_RISK_THRESHOLD: float = 0.4
    SUSPICIOUS_THRESHOLD: float = 0.7
    
    def evaluate(
        self,
        liveness_score: float,
        usage_score: Optional[float] = None,
        anomalies: Optional[List[str]] = None
    ) -> RiskAssessment:
        """
        Evaluate combined risk from liveness and usage scores.
        
        Args:
            liveness_score: Float 0-1 from Agent 2 (liveness detection)
            usage_score: Float 0-1 from Agent 1 (usage pattern), optional
            anomalies: List of detected usage anomalies
            
        Returns:
            RiskAssessment with combined evaluation
        """
        # Clamp liveness score
        liveness = max(0.0, min(1.0, liveness_score))
        
        # Handle usage score
        if usage_score is None:
            # No usage data - use only liveness
            usage = 1.0  # Assume normal if no history
            combined = liveness
        else:
            usage = max(0.0, min(1.0, usage_score))
            combined = (liveness * self.LIVENESS_WEIGHT) + (usage * self.USAGE_WEIGHT)
        
        # Classify based on combined score
        risk_level, explanation = self._classify(combined, liveness, usage, anomalies or [])
        
        return RiskAssessment(
            liveness_score=liveness,
            usage_score=usage,
            combined_score=combined,
            risk_level=risk_level,
            explanation=explanation,
            anomalies=anomalies or []
        )
    
    def _classify(
        self,
        combined: float,
        liveness: float,
        usage: float,
        anomalies: List[str]
    ) -> Tuple[RiskLevel, str]:
        """
        Classify combined score into risk level with explanation.
        
        Args:
            combined: Combined weighted score
            liveness: Liveness score from Agent 2
            usage: Usage score from Agent 1
            anomalies: List of detected anomalies
            
        Returns:
            Tuple of (RiskLevel, explanation string)
        """
        # Build explanation parts
        explanations = []
        
        # Determine risk level based on combined score
        if combined < self.HIGH_RISK_THRESHOLD:
            risk_level = RiskLevel.HIGH
            
            if liveness < 0.4:
                explanations.append("Strong spoof indicators detected")
            if usage < 0.5 and anomalies:
                explanations.append("Suspicious usage patterns found")
                
        elif combined < self.SUSPICIOUS_THRESHOLD:
            risk_level = RiskLevel.SUSPICIOUS
            
            if liveness < 0.7:
                explanations.append("Potential spoof indicators")
            if anomalies:
                explanations.append("Usage anomalies detected")
                
        else:
            risk_level = RiskLevel.NORMAL
            explanations.append("Fingerprint appears live and usage patterns are normal")
        
        # Add anomaly details
        if anomalies and risk_level != RiskLevel.NORMAL:
            anomaly_summary = "; ".join(anomalies[:2])  # Limit to first 2
            explanations.append(f"({anomaly_summary})")
        
        return risk_level, " - ".join(explanations) if explanations else "Analysis complete"
    
    def get_thresholds(self) -> dict:
        """Get current threshold configuration."""
        return {
            "high_risk_below": self.HIGH_RISK_THRESHOLD,
            "suspicious_below": self.SUSPICIOUS_THRESHOLD,
            "normal_above_or_equal": self.SUSPICIOUS_THRESHOLD,
            "liveness_weight": self.LIVENESS_WEIGHT,
            "usage_weight": self.USAGE_WEIGHT
        }
