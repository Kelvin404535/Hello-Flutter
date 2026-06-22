import sqlite3
from werkzeug.security import check_password_hash

conn = sqlite3.connect('instance/silo_management.db')
cursor = conn.cursor()

cursor.execute("SELECT id, username, email, password, role FROM users WHERE username='admin'")
admin = cursor.fetchone()

if admin:
    print(f"Admin found: {admin[1]} ({admin[2]})")
    print(f"Password hash: {admin[3][:50]}...")
    
    # Try common passwords
    passwords_to_try = ['admin123', 'admin', 'password', '123456', 'kelvin', 'admin@123']
    
    for pwd in passwords_to_try:
        if check_password_hash(admin[3], pwd):
            print(f"\n✅ PASSWORD FOUND: '{pwd}'")
            break
    else:
        print("\n❌ Common passwords didn't work")
else:
    print("No admin found")

conn.close()