"""
Seed Demo Usage Data

Creates synthetic usage history for demonstration purposes.
This allows testing the anomaly detection without real historical data.

USAGE:
    python training/seed_usage_data.py
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import init_database, record_usage, get_db_connection, clear_database


def seed_demo_data():
    """Create demo usage history for testing."""
    print("=" * 60)
    print("Seeding Demo Usage Data")
    print("=" * 60)
    
    # Initialize database
    init_database()
    
    # Clear existing data
    clear_database()
    print("Cleared existing data")
    
    # Demo fingerprint hashes
    FINGERPRINTS = {
        "fp_normal_user": "a1b2c3d4e5f6789012345678",
        "fp_high_frequency": "b2c3d4e5f67890123456789a",
        "fp_cross_case": "c3d4e5f6789012345678901b",
        "fp_reactivated": "d4e5f67890123456789012c3",
        "fp_suspicious": "e5f6789012345678901234d4"
    }
    
    CASES = ["CASE-001", "CASE-002", "CASE-003", "CASE-004", "CASE-005"]
    SECTORS = ["forensic", "hospital", "unknown"]
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Normal user - few uses, same case
        print("\n[1] Creating normal usage pattern...")
        fp = FINGERPRINTS["fp_normal_user"]
        for i in range(3):
            timestamp = datetime.now() - timedelta(days=i*10)
            cursor.execute('''
                INSERT INTO fingerprint_usage 
                (fingerprint_hash, case_id, sector, timestamp, liveness_score, risk_level)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (fp, "CASE-001", "forensic", timestamp.isoformat(), 0.85, "NORMAL"))
        print(f"   Created 3 normal uses for {fp[:12]}...")
        
        # 2. High frequency - many uses in last 24h
        print("\n[2] Creating high frequency pattern...")
        fp = FINGERPRINTS["fp_high_frequency"]
        for i in range(8):
            timestamp = datetime.now() - timedelta(hours=i*2)
            cursor.execute('''
                INSERT INTO fingerprint_usage 
                (fingerprint_hash, case_id, sector, timestamp, liveness_score, risk_level)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (fp, "CASE-002", "hospital", timestamp.isoformat(), 0.75, "NORMAL"))
        print(f"   Created 8 uses in 24h for {fp[:12]}...")
        
        # 3. Cross-case reuse - same fingerprint, different cases
        print("\n[3] Creating cross-case reuse pattern...")
        fp = FINGERPRINTS["fp_cross_case"]
        for i, case_id in enumerate(CASES[:4]):
            timestamp = datetime.now() - timedelta(days=i*5)
            cursor.execute('''
                INSERT INTO fingerprint_usage 
                (fingerprint_hash, case_id, sector, timestamp, liveness_score, risk_level)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (fp, case_id, "forensic", timestamp.isoformat(), 0.80, "NORMAL"))
        print(f"   Created 4 uses across 4 cases for {fp[:12]}...")
        
        # 4. Reactivated - dormant for 60 days, now active
        print("\n[4] Creating reactivation pattern...")
        fp = FINGERPRINTS["fp_reactivated"]
        # Old usage
        old_timestamp = datetime.now() - timedelta(days=60)
        cursor.execute('''
            INSERT INTO fingerprint_usage 
            (fingerprint_hash, case_id, sector, timestamp, liveness_score, risk_level)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (fp, "CASE-003", "hospital", old_timestamp.isoformat(), 0.90, "NORMAL"))
        print(f"   Created dormant record (60 days ago) for {fp[:12]}...")
        
        # 5. Suspicious - low liveness scores
        print("\n[5] Creating suspicious liveness pattern...")
        fp = FINGERPRINTS["fp_suspicious"]
        for i in range(2):
            timestamp = datetime.now() - timedelta(days=i)
            cursor.execute('''
                INSERT INTO fingerprint_usage 
                (fingerprint_hash, case_id, sector, timestamp, liveness_score, risk_level)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (fp, "CASE-004", "forensic", timestamp.isoformat(), 0.35, "HIGH"))
        print(f"   Created 2 suspicious uses for {fp[:12]}...")
        
        conn.commit()
    
    print("\n" + "=" * 60)
    print("Demo Data Seeded Successfully!")
    print("=" * 60)
    print("\nTest scenarios:")
    print("  • Normal user: Submit any new fingerprint → NORMAL")
    print("  • High frequency: Submit same image 6+ times quickly → SUSPICIOUS")
    print("  • Cross-case: Submit same image with different case_id → SUSPICIOUS")
    print("=" * 60)


if __name__ == '__main__':
    seed_demo_data()
