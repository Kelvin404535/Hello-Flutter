import sqlite3
conn = sqlite3.connect('instance/silo_management.db')
cursor = conn.execute('SELECT username, email FROM users WHERE role = "admin"')
row = cursor.fetchone()
if row:
    print(f'Admin: {row[0]} - Email: {row[1]}')
else:
    print('No admin found')
conn.close()