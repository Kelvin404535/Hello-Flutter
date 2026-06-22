import sqlite3
from werkzeug.security import check_password_hash

print("=" * 50)
print("DIAGNOSING LOGIN ISSUE")
print("=" * 50)

conn = sqlite3.connect('instance/silo_management.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Check users table
c.execute("SELECT id, username, email, role FROM users")
users = c.fetchall()
print(f"\n📋 Users in database ({len(users)}):")
for u in users:
    print(f"   ID: {u['id']}, Username: {u['username']}, Email: {u['email']}, Role: {u['role']}")

# Check password for admin
c.execute("SELECT password FROM users WHERE username = 'admin'")
row = c.fetchone()

if row:
    print(f"\n🔐 Testing password for 'admin':")
    print(f"   Hash: {row['password'][:40]}...")
    
    test_password = 'admin123'
    result = check_password_hash(row['password'], test_password)
    print(f"   Password '{test_password}' matches: {result}")
    
    if not result:
        # Try other common passwords
        common = ['admin', 'password', '123456', 'admin@123', 'Kelvin123']
        for pwd in common:
            if check_password_hash(row['password'], pwd):
                print(f"   ✅ FOUND! Password is actually: {pwd}")
                break

# Check what columns exist in users table
c.execute("PRAGMA table_info(users)")
columns = c.fetchall()
print(f"\n📊 Columns in 'users' table:")
for col in columns:
    print(f"   {col['name']} ({col['type']})")

conn.close()

print("\n" + "=" * 50)
print("NEXT STEPS:")
print("1. Make sure your login form uses 'email' field name")
print("2. Check if users need 'is_approved' = 1")
print("=" * 50)