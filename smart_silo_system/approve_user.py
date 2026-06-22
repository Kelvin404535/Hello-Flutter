import sqlite3
import random
import string
from werkzeug.security import generate_password_hash

conn = sqlite3.connect('instance/silo_management.db')

# Get first pending user
pending = conn.execute('SELECT id, full_name, email, phone, preferred_username, requested_role FROM pending_users WHERE status = "pending" LIMIT 1').fetchone()

if pending:
    print(f'Approving: {pending[1]}')
    
    # Generate worker number
    count = conn.execute('SELECT COUNT(*) FROM users WHERE username LIKE "WK-%"').fetchone()[0]
    worker_number = f'WK-{count+1:04d}'
    
    # Generate temporary password (stronger)
    chars = string.ascii_letters + string.digits + '!@#$%^&*'
    temp_pwd = ''.join(random.choice(chars) for _ in range(12))
    
    # Use werkzeug's secure hashing (compatible with app.py login)
    hashed = generate_password_hash(temp_pwd)
    
    # Insert user
    conn.execute('INSERT INTO users (username, password, email, phone, full_name, role) VALUES (?,?,?,?,?,?)',
                 (worker_number, hashed, pending[2], pending[3], pending[1], pending[5]))
    
    # Update pending status
    conn.execute('UPDATE pending_users SET status = "approved" WHERE id = ?', (pending[0],))
    conn.commit()
    
    print(f'✅ Approved!')
    print(f'   Username: {worker_number}')
    print(f'   Password: {temp_pwd}')
    print(f'   Email: {pending[2]}')
else:
    print('No pending users found')

conn.close()