"""
Database Module

SQLite-based storage for fingerprint usage tracking.
Enables Agent 1 (Usage Pattern Analysis) to detect anomalies.
"""

import os
import sqlite3
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from contextlib import contextmanager


# Database file location
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'usage.db')


def get_fingerprint_hash(image_bytes: bytes) -> str:
    """
    Generate a hash for fingerprint identification.
    
    Used to track the same fingerprint across multiple submissions
    without storing the actual image.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        SHA-256 hash of the image
    """
    return hashlib.sha256(image_bytes).hexdigest()[:32]


@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_database():
    """Initialize database tables."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Fingerprint usage tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fingerprint_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fingerprint_hash TEXT NOT NULL,
                case_id TEXT,
                sector TEXT DEFAULT 'unknown',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                liveness_score REAL,
                risk_level TEXT
            )
        ''')
        
        # Index for fast lookups
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_fingerprint_hash 
            ON fingerprint_usage(fingerprint_hash)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_timestamp 
            ON fingerprint_usage(timestamp)
        ''')
        
        conn.commit()


def record_usage(
    fingerprint_hash: str,
    case_id: Optional[str] = None,
    sector: str = "unknown",
    liveness_score: Optional[float] = None,
    risk_level: Optional[str] = None
) -> int:
    """
    Record a fingerprint usage event.
    
    Args:
        fingerprint_hash: Hash of the fingerprint image
        case_id: Optional case/record identifier
        sector: Usage sector (forensic/hospital/unknown)
        liveness_score: Score from liveness agent
        risk_level: Risk level from risk engine
        
    Returns:
        ID of the created record
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fingerprint_usage 
            (fingerprint_hash, case_id, sector, liveness_score, risk_level)
            VALUES (?, ?, ?, ?, ?)
        ''', (fingerprint_hash, case_id, sector, liveness_score, risk_level))
        conn.commit()
        return cursor.lastrowid


def get_usage_history(
    fingerprint_hash: str,
    days: int = 90
) -> List[Dict]:
    """
    Get usage history for a fingerprint.
    
    Args:
        fingerprint_hash: Hash to look up
        days: Number of days to look back
        
    Returns:
        List of usage records
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cutoff = datetime.now() - timedelta(days=days)
        
        cursor.execute('''
            SELECT * FROM fingerprint_usage
            WHERE fingerprint_hash = ?
            AND timestamp > ?
            ORDER BY timestamp DESC
        ''', (fingerprint_hash, cutoff.isoformat()))
        
        return [dict(row) for row in cursor.fetchall()]


def get_usage_stats(fingerprint_hash: str) -> Dict:
    """
    Get aggregate statistics for a fingerprint.
    
    Args:
        fingerprint_hash: Hash to analyze
        
    Returns:
        Dictionary with usage statistics
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Total uses
        cursor.execute('''
            SELECT COUNT(*) as total_uses,
                   COUNT(DISTINCT case_id) as unique_cases,
                   COUNT(DISTINCT sector) as unique_sectors,
                   MIN(timestamp) as first_seen,
                   MAX(timestamp) as last_seen
            FROM fingerprint_usage
            WHERE fingerprint_hash = ?
        ''', (fingerprint_hash,))
        
        stats = dict(cursor.fetchone())
        
        # Uses in last 24 hours
        yesterday = datetime.now() - timedelta(hours=24)
        cursor.execute('''
            SELECT COUNT(*) as uses_24h
            FROM fingerprint_usage
            WHERE fingerprint_hash = ?
            AND timestamp > ?
        ''', (fingerprint_hash, yesterday.isoformat()))
        
        stats['uses_24h'] = cursor.fetchone()['uses_24h']
        
        # Uses in last 7 days
        week_ago = datetime.now() - timedelta(days=7)
        cursor.execute('''
            SELECT COUNT(*) as uses_7d
            FROM fingerprint_usage
            WHERE fingerprint_hash = ?
            AND timestamp > ?
        ''', (fingerprint_hash, week_ago.isoformat()))
        
        stats['uses_7d'] = cursor.fetchone()['uses_7d']
        
        return stats


def clear_database():
    """Clear all usage records (for testing)."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM fingerprint_usage')
        conn.commit()


# Initialize database on module import
init_database()
