import sqlite3
conn = sqlite3.connect('instance/silo_management.db')
conn.execute('INSERT INTO pending_users (full_name, email, phone, preferred_username, requested_role, status) VALUES (?, ?, ?, ?, ?, ?)',
             ('Fresh User', 'fresh@example.com', '0712345678', 'freshuser', 'staff', 'pending'))
conn.commit()
print('New pending user created!')
conn.close()
