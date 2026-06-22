import sqlite3
conn = sqlite3.connect('instance/silo_management.db')
c = conn.execute('SELECT id, full_name, email, created_at FROM pending_users WHERE status = "pending"')
rows = c.fetchall()
print(f'Found {len(rows)} pending users')
for r in rows:
    print(f'ID:{r[0]} Name:{r[1]} Email:{r[2]} Created:{r[3]}')
conn.close()
