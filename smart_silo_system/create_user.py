import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = 'instance/silo_management.db'

print("Creating user in database...")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create tables if they don't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'farmer',
    is_approved INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Create admin user
username = "admin"
email = "admin@example.com"
password = "admin123"
role = "admin"

hashed_pw = generate_password_hash(password)

try:
    cursor.execute(
        "INSERT INTO user (username, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)",
        (username, email, hashed_pw, role, 1)
    )
    conn.commit()
    print(f"\n✅ User created successfully!")
    print(f"   Username: {username}")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    print(f"   Role: {role}")
except sqlite3.IntegrityError:
    print(f"\n⚠️ User '{username}' already exists")

# Show all users
cursor.execute("SELECT id, username, email, role FROM user")
users = cursor.fetchall()
print("\n--- All Users ---")
for u in users:
    print(f"   ID: {u[0]}, Username: {u[1]}, Email: {u[2]}, Role: {u[3]}")

conn.close()