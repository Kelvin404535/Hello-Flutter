import sqlite3
import random
import string
import hashlib
from flask import Flask
from flask_mail import Mail, Message

# Create Flask app for email
app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'kk3478787@gmail.com'
app.config['MAIL_PASSWORD'] = 'jlchktqssypctods'
app.config['MAIL_DEFAULT_SENDER'] = 'kk3478787@gmail.com'
mail = Mail(app)

conn = sqlite3.connect('instance/silo_management.db')
salt = 'smart_silo_salt_2026'

# Get first pending user
pending = conn.execute('SELECT id, full_name, email, phone, preferred_username, requested_role FROM pending_users WHERE status = "pending" LIMIT 1').fetchone()

if pending:
    print(f'Approving: {pending[1]} ({pending[2]})')
    
    # Generate worker number
    count = conn.execute('SELECT COUNT(*) FROM users WHERE username LIKE "WK-%"').fetchone()[0]
    worker_number = f'WK-{count+1:04d}'
    
    # Generate temporary password
    chars = string.ascii_letters + string.digits + '!@#$'
    temp_pwd = ''.join(random.choice(chars) for _ in range(10))
    hashed = hashlib.sha256((temp_pwd + salt).encode()).hexdigest()
    
    # Insert user
    conn.execute('INSERT INTO users (username, password, email, phone, full_name, role) VALUES (?,?,?,?,?,?)',
                 (worker_number, hashed, pending[2], pending[3], pending[1], pending[5]))
    
    # Update pending status
    conn.execute('UPDATE pending_users SET status = "approved" WHERE id = ?', (pending[0],))
    conn.commit()
    
    # Send approval email
    with app.app_context():
        subject = "Account Approved - Smart Silo System"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head><style>
            body {{ font-family: Arial; }}
            .container {{ padding: 20px; background: #f0fdf4; border-radius: 10px; }}
        </style></head>
        <body>
            <div class="container">
                <h2>Welcome to Smart Silo System, {pending[1]}!</h2>
                <p>Your account has been approved.</p>
                <p><strong>Worker Number (Username):</strong> {worker_number}</p>
                <p><strong>Temporary Password:</strong> {temp_pwd}</p>
                <p><a href="http://localhost:5000/login">Click here to login</a></p>
            </div>
        </body>
        </html>
        """
        msg = Message(subject, recipients=[pending[2]])
        msg.html = html_body
        mail.send(msg)
        print(f'✅ Approval email sent to {pending[2]}')
        print(f'📋 Username: {worker_number}, Password: {temp_pwd}')
else:
    print('No pending users found')

conn.close()
