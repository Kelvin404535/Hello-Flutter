import sqlite3
from werkzeug.security import check_password_hash

conn = sqlite3.connect('instance/silo_management.db')
c = conn.cursor()

# Get all users with WK- prefix
c.execute("SELECT username, password FROM users WHERE username LIKE 'WK-%'")
users = c.fetchall()

print("=" * 50)
print("Checking User Passwords")
print("=" * 50)

if not users:
    print("No WK- users found")
else:
    for user in users:
        username = user[0]
        password_hash = user[1]
        
        # Check what type of hash it is
        if password_hash.startswith('scrypt:'):
            hash_type = "scrypt (werkzeug) - GOOD"
        elif password_hash.startswith('pbkdf2:'):
            hash_type = "pbkdf2 (werkzeug) - GOOD"
        elif password_hash.startswith('bcrypt:'):
            hash_type = "bcrypt (werkzeug) - GOOD"
        else:
            hash_type = f"SHA256 or other - BAD (starts with {password_hash[:15]})"
        
        print(f"\nUsername: {username}")
        print(f"Hash type: {hash_type}")
        
        # Test with common passwords
        test_passwords = ['admin123', 'password123', 'Test@123']
        for test_pwd in test_passwords:
            try:
                if check_password_hash(password_hash, test_pwd):
                    print(f"✅ PASSWORD FOUND: {test_pwd}")
                    break
            except:
                pass

conn.close()

print("\n" + "=" * 50)
print("Also check your app.py hash_password function:")
print("=" * 50)