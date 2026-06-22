import sqlite3
from werkzeug.security import check_password_hash

# Get the verify_password function from your app
import sys
sys.path.insert(0, '.')
from app import verify_password

conn = sqlite3.connect('instance/silo_management.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Get admin user
c.execute("SELECT * FROM users WHERE email = 'kelvinkemboi608@gmail.com'")
user = c.fetchone()

if user:
    print(f"User found: {user['email']}")
    print(f"Password hash: {user['password'][:40]}...")
    
    # Test with werkzeug's check_password_hash
    result1 = check_password_hash(user['password'], 'admin123')
    print(f"werkzeug check: {result1}")
    
    # Test with your app's verify_password function
    result2 = verify_password('admin123', user['password'])
    print(f"app.verify_password: {result2}")
    
    if not result2:
        print("\n⚠️ Your verify_password function might be the problem!")
        print("Let me see what verify_password looks like.")
else:
    print("User not found")

conn.close()