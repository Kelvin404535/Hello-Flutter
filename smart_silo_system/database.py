import sqlite3
import hashlib
from datetime import datetime

DB_PATH = 'instance/silo_management.db'

def create_database():
    """Create all tables for the silo management system"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # ============================================
    # 1. USERS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            role TEXT NOT NULL,
            full_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print("✓ Created: users table")
    
    # ============================================
    # 2. SILOS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS silos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            silo_number TEXT UNIQUE NOT NULL,
            location TEXT,
            capacity_kg REAL DEFAULT 0,
            current_stock_kg REAL DEFAULT 0,
            grain_type TEXT,
            sensor_id TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print("✓ Created: silos table")
    
    # ============================================
    # 3. SILO CONDITIONS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS silo_conditions (
            silo_id INTEGER PRIMARY KEY,
            temperature REAL,
            moisture REAL,
            humidity REAL,
            risk_level TEXT DEFAULT 'unknown',
            last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (silo_id) REFERENCES silos(id)
        )
    ''')
    print("✓ Created: silo_conditions table")
    
    # ============================================
    # 4. FARMERS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_number TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            location TEXT,
            total_delivered_kg REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print("✓ Created: farmers table")
    
    # ============================================
    # 5. GRAIN BATCHES TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS grain_batches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_number TEXT UNIQUE NOT NULL,
            silo_id INTEGER NOT NULL,
            grain_type TEXT NOT NULL,
            quantity_kg REAL NOT NULL,
            moisture REAL,
            entry_date DATE NOT NULL,
            farmer_id INTEGER,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (silo_id) REFERENCES silos(id),
            FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        )
    ''')
    print("✓ Created: grain_batches table")
    
    # ============================================
    # 6. SENSOR READINGS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            silo_id INTEGER NOT NULL,
            temperature REAL,
            moisture REAL,
            humidity REAL,
            reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (silo_id) REFERENCES silos(id)
        )
    ''')
    print("✓ Created: sensor_readings table")
    
    # ============================================
    # 7. TRANSACTIONS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            silo_id INTEGER NOT NULL,
            batch_id INTEGER,
            transaction_type TEXT NOT NULL,
            quantity_kg REAL NOT NULL,
            transaction_date DATE NOT NULL,
            notes TEXT,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (silo_id) REFERENCES silos(id),
            FOREIGN KEY (batch_id) REFERENCES grain_batches(id),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    ''')
    print("✓ Created: transactions table")
    
    # ============================================
    # 8. ALERTS TABLE
    # ============================================
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            silo_id INTEGER NOT NULL,
            alert_type TEXT,
            severity TEXT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (silo_id) REFERENCES silos(id)
        )
    ''')
    print("✓ Created: alerts table")
    
    # ============================================
    # INSERT DEFAULT DATA
    # ============================================
    
    # Create admin user
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
    if cursor.fetchone()[0] == 0:
        hashed = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (username, password, email, role, full_name)
            VALUES (?, ?, ?, ?, ?)
        ''', ('admin', hashed, 'admin@example.com', 'admin', 'System Admin'))
        print("✓ Created: admin user (admin / admin123)")
    
    # Create silo manager
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'manager'")
    if cursor.fetchone()[0] == 0:
        hashed = hashlib.sha256('manager123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (username, password, email, role, full_name)
            VALUES (?, ?, ?, ?, ?)
        ''', ('manager', hashed, 'manager@example.com', 'silo_manager', 'Silo Manager'))
        print("✓ Created: manager user (manager / manager123)")
    
    # Create sample silos
    cursor.execute("SELECT COUNT(*) FROM silos")
    if cursor.fetchone()[0] == 0:
        sample_silos = [
            ('S-001', 'Zone A', 100000, 45000, 'Maize', None),
            ('S-002', 'Zone A', 100000, 48000, 'Maize', None),
            ('S-003', 'Zone B', 75000, 72000, 'Wheat', None),
            ('S-004', 'Zone B', 75000, 68000, 'Rice', None),
            ('S-005', 'Zone C', 50000, 35000, 'Sorghum', None),
        ]
        
        for silo in sample_silos:
            cursor.execute('''
                INSERT INTO silos (silo_number, location, capacity_kg, current_stock_kg, grain_type, sensor_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', silo)
            silo_id = cursor.lastrowid
            cursor.execute("INSERT INTO silo_conditions (silo_id) VALUES (?)", (silo_id,))
        
        print(f"✓ Created: {len(sample_silos)} sample silos")
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*50)
    print("✅ DATABASE CREATED SUCCESSFULLY!")
    print(f"📁 Location: {DB_PATH}")
    print("="*50)
    
    return True

if __name__ == '__main__':
    print("="*50)
    print("🌾 SMART SILO SYSTEM - DATABASE SETUP")
    print("="*50)
    create_database()