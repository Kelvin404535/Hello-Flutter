import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = 'instance/silo_management.db'

print("=" * 50)
print("Setting up Smart Silo Database")
print("=" * 50)

os.makedirs('instance', exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create all tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✓ password_resets table ready")

cursor.execute('''
CREATE TABLE IF NOT EXISTS pending_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'farmer',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✓ pending_users table ready")

cursor.execute('''
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'farmer',
    is_approved INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✓ user table ready")

cursor.execute('''
CREATE TABLE IF NOT EXISTS silo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    silo_number TEXT UNIQUE NOT NULL,
    location TEXT,
    grain_type TEXT,
    capacity REAL,
    stock REAL DEFAULT 0,
    moisture REAL DEFAULT 0,
    temperature REAL DEFAULT 0,
    status TEXT DEFAULT 'normal'
)
''')
print("✓ silo table ready")

cursor.execute('''
CREATE TABLE IF NOT EXISTS transaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    silo_id INTEGER,
    type TEXT,
    quantity REAL,
    reason TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✓ transaction table ready")

# Create admin user
cursor.execute("SELECT * FROM user WHERE username = ?", ('admin',))
admin = cursor.fetchone()

if not admin:
    hashed_pw = generate_password_hash('admin123')
    cursor.execute(
        "INSERT INTO user (username, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)",
        ('admin', 'admin@example.com', hashed_pw, 'admin', 1)
    )
    print("\n✅ Admin user created!")
    print("   Username: admin")
    print("   Password: admin123")
else:
    print("\n✅ Admin user already exists")

# Show all users
cursor.execute("SELECT id, username, email, role, is_approved FROM user")
users = cursor.fetchall()
print("\n--- Current Users ---")
for u in users:
    approved = "✓" if u[4] == 1 else "✗"
    print(f"  {approved} {u[1]} | {u[2]} | Role: {u[3]}")

conn.commit()
conn.close()

print("\n✅ Database setup complete!")