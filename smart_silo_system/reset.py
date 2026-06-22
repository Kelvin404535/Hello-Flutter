import sqlite3
from werkzeug.security import generate_password_hash

conn = sqlite3.connect('instance/silo_management.db')
c = conn.cursor()
c.execute("UPDATE users SET password = ? WHERE username = ?", (generate_password_hash('admin123'), 'admin'))
conn.commit()
print('Password reset to admin123')
conn.close()