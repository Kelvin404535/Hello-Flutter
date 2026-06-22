import sqlite3
from werkzeug.security import check_password_hash

conn = sqlite3.connect('instance/silo_management.db')
cursor = conn.cursor()

cursor.execute("SELECT password FROM user WHERE username = 'admin'")
row = cursor.fetchone()

if row:
    password_hash = row[0]
    is_correct = check_password_hash(password_hash, 'admin123')
    print(f"Password hash: {password_hash[:30]}...")
    print(f"Password 'admin123' is correct: {is_correct}")
else:
    print("No user found with username 'admin'")

conn.close()