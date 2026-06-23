from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_file, flash
from flask_mail import Mail, Message
import sqlite3
import hashlib
import re
import secrets
import random
import string
from datetime import datetime, timedelta
from functools import wraps
import io
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

app = Flask(__name__)
app.secret_key = 'smart_silo_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# ========== EMAIL CONFIGURATION ==========
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'kk3478787@gmail.com'
app.config['MAIL_PASSWORD'] = 'jlchktqssypctods'
app.config['MAIL_DEFAULT_SENDER'] = 'kk3478787@gmail.com'
app.config['MAIL_DEBUG'] = True

mail = Mail(app)

DB_PATH = 'instance/silo_management.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Password functions
def is_strong_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Need 1 uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Need 1 lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Need 1 number"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Need 1 special character"
    return True, "Strong password"

def hash_password(password):
    from werkzeug.security import generate_password_hash
    return generate_password_hash(password)

def verify_password(password, hashed):
    from werkzeug.security import check_password_hash
    return check_password_hash(hashed, password)

# Account lockout
failed_attempts = {}
locked_accounts = {}

def check_account_lockout(identifier):
    if identifier in locked_accounts:
        if datetime.now() < locked_accounts[identifier]:
            return True, f"Account locked until {locked_accounts[identifier].strftime('%H:%M:%S')}"
        else:
            del locked_accounts[identifier]
            del failed_attempts[identifier]
    return False, None

def record_failed_attempt(identifier):
    failed_attempts[identifier] = failed_attempts.get(identifier, 0) + 1
    if failed_attempts[identifier] >= 5:
        locked_accounts[identifier] = datetime.now() + timedelta(minutes=15)

def reset_failed_attempts(identifier):
    if identifier in failed_attempts:
        del failed_attempts[identifier]
    if identifier in locked_accounts:
        del locked_accounts[identifier]

# Email function
def send_test_email(recipient_email):
    try:
        msg = Message('Test Alert - Smart Silo System', recipients=[recipient_email])
        msg.html = '''
        <!DOCTYPE html>
        <html>
        <head><style>
            body { font-family: Arial; }
            .container { padding: 20px; background: #f0fdf4; border-radius: 10px; }
            h2 { color: #10b981; }
        </style></head>
        <body>
            <div class="container">
                <h2>✅ Test Alert</h2>
                <p>Your Smart Silo alert system is working correctly!</p>
                <p>You will receive alerts when:</p>
                <ul>
                    <li>🔴 Critical risk (moisture > 14% or days > 90)</li>
                    <li>🟡 Warning risk (moisture > 12.5% or days > 60)</li>
                    <li>📦 Low stock (less than 10% capacity)</li>
                </ul>
                <hr>
                <p><small>Smart Silo Management System</small></p>
            </div>
        </body>
        </html>
        '''
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

# Decorators
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        if session.get('role') != 'admin':
            return "Access Denied", 403
        return f(*args, **kwargs)
    return decorated

# Risk calculation
def calculate_risk(moisture, days_stored):
    if moisture is None or moisture == 0:
        return 'gray', 'No data entered'
    if moisture > 14 or days_stored > 90:
        return 'red', f'CRITICAL: {moisture}% moisture, {days_stored} days'
    elif moisture > 12.5 or days_stored > 60:
        return 'yellow', f'WARNING: {moisture}% moisture, {days_stored} days'
    else:
        return 'green', f'SAFE: {moisture}% moisture, {days_stored} days'

# ========== ALERT FUNCTIONS ==========
def save_alert_to_db(silo_id, alert_type, severity, message):
    try:
        conn = get_db()
        conn.execute("INSERT INTO alerts (silo_id, alert_type, severity, message, is_read) VALUES (?, ?, ?, ?, 0)", 
                    (silo_id, alert_type, severity, message))
        conn.commit()
        conn.close()
        print(f"✅ Alert saved: {severity} - {message[:50]}")
    except Exception as e:
        print(f"❌ Alert save error: {e}")

def check_and_send_alerts():
    print("🔍 Checking silos for risks...")
    try:
        conn = get_db()
        silos = conn.execute("""
            SELECT s.*, 
                   COALESCE((SELECT moisture FROM grain_batches WHERE silo_id = s.id ORDER BY entry_date DESC LIMIT 1), 0) as moisture,
                   COALESCE((SELECT entry_date FROM grain_batches WHERE silo_id = s.id ORDER BY entry_date DESC LIMIT 1), NULL) as entry_date
            FROM silos s WHERE s.status = 'active'
        """).fetchall()
        
        alerts_created = 0
        
        for silo in silos:
            days_stored = 0
            if silo['entry_date']:
                try:
                    entry = datetime.strptime(silo['entry_date'], '%Y-%m-%d')
                    days_stored = (datetime.now() - entry).days
                except:
                    pass
            
            moisture = silo['moisture'] if silo['moisture'] else 0
            stock_percentage = (silo['current_stock_kg'] / silo['capacity_kg'] * 100) if silo['capacity_kg'] and silo['capacity_kg'] > 0 else 100
            
            if moisture > 14 or days_stored > 90:
                message = f"CRITICAL: {moisture}% moisture, {days_stored} days stored"
                save_alert_to_db(silo['id'], 'high_moisture', 'critical', message)
                alerts_created += 1
            elif moisture > 12.5 or days_stored > 60:
                message = f"WARNING: {moisture}% moisture, {days_stored} days stored"
                save_alert_to_db(silo['id'], 'high_moisture', 'warning', message)
                alerts_created += 1
            
            if stock_percentage < 10 and silo['current_stock_kg'] > 0:
                message = f"LOW STOCK: {silo['current_stock_kg']}kg remaining ({stock_percentage:.1f}% of capacity)"
                save_alert_to_db(silo['id'], 'low_stock', 'warning', message)
                alerts_created += 1
        
        conn.close()
        print(f"✅ Alert check complete. {alerts_created} alerts created.")
    except Exception as e:
        print(f"❌ Alert check error: {e}")

# ========== FORGOT PASSWORD ==========
@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        
        if user:
            token = secrets.token_urlsafe(32)
            expiry = datetime.now() + timedelta(hours=1)
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS password_resets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    token TEXT,
                    expiry TIMESTAMP
                )
            ''')
            conn.execute("DELETE FROM password_resets WHERE email = ?", (email,))
            conn.execute("INSERT INTO password_resets (email, token, expiry) VALUES (?, ?, ?)", (email, token, expiry))
            conn.commit()
            
            reset_link = f"http://localhost:5000/reset-password/{token}"
            try:
                msg = Message('Password Reset - Smart Silo System', recipients=[email])
                msg.html = f'''
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="{reset_link}">Reset Password</a>
                <p>This link expires in 1 hour.</p>
                '''
                mail.send(msg)
                conn.close()
                return render_template('forgot_password.html', message='Reset link sent to your email.')
            except Exception as e:
                print(f"Email error: {e}")
                conn.close()
                return render_template('forgot_password.html', error='Failed to send email. Try again.')
        else:
            conn.close()
            return render_template('forgot_password.html', error='Email not found.')
    
    return render_template('forgot_password.html')

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    conn = get_db()
    reset = conn.execute("SELECT * FROM password_resets WHERE token = ? AND expiry > datetime('now')", (token,)).fetchone()
    
    if not reset:
        conn.close()
        return render_template('reset_password.html', error='Invalid or expired link.')
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm = request.form.get('confirm_password')
        
        if password != confirm:
            return render_template('reset_password.html', error='Passwords do not match.')
        
        is_strong, msg = is_strong_password(password)
        if not is_strong:
            return render_template('reset_password.html', error=msg)
        
        hashed = hash_password(password)
        conn.execute("UPDATE users SET password = ? WHERE email = ?", (hashed, reset['email']))
        conn.execute("DELETE FROM password_resets WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        
        return redirect(url_for('login'))
    
    conn.close()
    return render_template('reset_password.html')

# ========== SIGN UP / REGISTER ==========
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        preferred_username = request.form.get('preferred_username')
        role = request.form.get('role', 'staff')
        
        errors = []
        
        if not full_name:
            errors.append("Full name is required")
        if not email or '@' not in email:
            errors.append("Valid email address is required")
        if not preferred_username or len(preferred_username) < 3:
            errors.append("Preferred username must be at least 3 characters")
        
        if errors:
            return render_template('register.html', errors=errors, form_data=request.form)
        
        conn = get_db()
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            errors.append("Email already registered.")
            conn.close()
            return render_template('register.html', errors=errors, form_data=request.form)
        
        existing_username = conn.execute("SELECT id FROM users WHERE username = ?", (preferred_username,)).fetchone()
        if existing_username:
            errors.append("Username already taken.")
            conn.close()
            return render_template('register.html', errors=errors, form_data=request.form)
        
        conn.execute("""
            INSERT INTO pending_users (full_name, email, phone, preferred_username, requested_role, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        """, (full_name, email, phone, preferred_username, role))
        conn.commit()
        conn.close()
        
        return render_template('registration_pending.html', name=full_name)
    
    return render_template('register.html', form_data={})

@app.route('/admin-pending-users')
@login_required
@admin_required
def admin_pending_users():
    conn = get_db()
    pending = conn.execute("SELECT * FROM pending_users WHERE status = 'pending' ORDER BY created_at DESC").fetchall()
    conn.close()
    return render_template('admin_pending_users.html', pending_users=pending)

@app.route('/approve-user/<int:user_id>')
@login_required
@admin_required
def approve_user(user_id):
    conn = get_db()
    pending = conn.execute("SELECT * FROM pending_users WHERE id = ?", (user_id,)).fetchone()
    
    if not pending:
        conn.close()
        return redirect(url_for('admin_pending_users'))
    
    last = conn.execute("SELECT username FROM users WHERE username LIKE 'WK-%' ORDER BY id DESC LIMIT 1").fetchone()
    if last:
        num = int(last['username'].split('-')[1]) + 1
        worker_number = f"WK-{num:04d}"
    else:
        worker_number = "WK-0001"
    
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    temp_password = ''.join(random.choice(characters) for _ in range(12))
    hashed_password = hash_password(temp_password)
    
    conn.execute("""
        INSERT INTO users (username, password, email, phone, full_name, role)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (worker_number, hashed_password, pending['email'], pending['phone'], pending['full_name'], pending['requested_role']))
    
    conn.execute("UPDATE pending_users SET status = 'approved' WHERE id = ?", (user_id,))
    conn.commit()
    
    email_sent = False
    email_error = None
    
    try:
        msg = Message(
            subject='✅ Account Approved - Smart Silo System',
            recipients=[pending['email']],
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head><style>
            body {{ font-family: Arial; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; background: #f0fdf4; border-radius: 10px; }}
            h2 {{ color: #10b981; }}
            .credentials {{ background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }}
            .warning {{ color: #e67e22; }}
        </style></head>
        <body>
            <div class="container">
                <h2>✅ Welcome to Smart Silo System!</h2>
                <p>Dear <strong>{pending['full_name']}</strong>,</p>
                <p>Your account has been approved.</p>
                <div class="credentials">
                    <h3>Login Credentials:</h3>
                    <p><strong>Worker Number:</strong> {worker_number}</p>
                    <p><strong>Temporary Password:</strong> <code>{temp_password}</code></p>
                    <p><strong>Email:</strong> {pending['email']}</p>
                </div>
                <p class="warning">⚠️ Please change your password after first login.</p>
                <a href="http://localhost:5000/login">Login Here</a>
                <hr>
                <small>Smart Silo Management System</small>
            </div>
        </body>
        </html>
        '''
        mail.send(msg)
        email_sent = True
        print(f"✅ Approval email sent to {pending['email']}")
    except Exception as e:
        email_error = str(e)
        print(f"❌ Email failed: {email_error}")
    
    conn.close()
    
    if email_sent:
        flash(f"✅ User {pending['full_name']} approved! Credentials sent to {pending['email']}", "success")
    else:
        flash(f"⚠️ User approved but email failed: {email_error}. Username: {worker_number}, Password: {temp_password}", "warning")
    
    return redirect(url_for('admin_pending_users'))

@app.route('/reject-user/<int:user_id>')
@login_required
@admin_required
def reject_user(user_id):
    conn = get_db()
    pending = conn.execute("SELECT * FROM pending_users WHERE id = ?", (user_id,)).fetchone()
    
    if pending:
        conn.execute("UPDATE pending_users SET status = 'rejected' WHERE id = ?", (user_id,))
        try:
            msg = Message('Account Update - Smart Silo System', recipients=[pending['email']])
            msg.body = "Your registration has been declined. Please contact administrator."
            mail.send(msg)
        except:
            pass
        conn.commit()
    
    conn.close()
    return redirect(url_for('admin_pending_users'))

@app.context_processor
def inject_pending_count():
    if 'user_id' in session and session.get('role') == 'admin':
        conn = get_db()
        count = conn.execute("SELECT COUNT(*) as count FROM pending_users WHERE status = 'pending'").fetchone()
        conn.close()
        return {'pending_count': count['count'] if count else 0}
    return {'pending_count': 0}

# ========== MAIN ROUTES ==========
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        is_locked, lock_msg = check_account_lockout(email)
        if is_locked:
            return render_template('login.html', error=lock_msg)
        
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()
        
        if user and verify_password(password, user['password']):
            reset_failed_attempts(email)
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['email'] = user['email']
            session['role'] = user['role']
            session.permanent = True
            return redirect(url_for('dashboard'))
        else:
            record_failed_attempt(email)
            return render_template('login.html', error='Invalid email or password')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    check_and_send_alerts()
    conn = get_db()
    silos = conn.execute("""
        SELECT s.*, 
               COALESCE((SELECT moisture FROM grain_batches WHERE silo_id = s.id ORDER BY entry_date DESC LIMIT 1), 0) as moisture
        FROM silos s 
        WHERE s.status = 'active' 
        ORDER BY s.silo_number
    """).fetchall()
    
    silo_data = []
    red_count = yellow_count = green_count = 0
    total_stock = 0
    
    for silo in silos:
        batch = conn.execute("SELECT entry_date FROM grain_batches WHERE silo_id = ? ORDER BY entry_date DESC LIMIT 1", (silo['id'],)).fetchone()
        days_stored = 0
        if batch:
            try:
                entry = datetime.strptime(batch['entry_date'], '%Y-%m-%d')
                days_stored = (datetime.now() - entry).days
            except:
                pass
        
        moisture = silo['moisture'] if silo['moisture'] else 0
        color, message = calculate_risk(moisture, days_stored)
        
        if color == 'red': red_count += 1
        elif color == 'yellow': yellow_count += 1
        elif color == 'green': green_count += 1
        total_stock += silo['current_stock_kg'] or 0
        
        silo_data.append({
            'id': silo['id'], 'number': silo['silo_number'], 'location': silo['location'] or '-',
            'grain_type': silo['grain_type'] or 'Empty', 'stock': silo['current_stock_kg'] or 0,
            'capacity': silo['capacity_kg'] or 0, 'moisture': round(moisture, 1) if moisture else '-',
            'color': color, 'message': message
        })
    
    # Get recycle bin count
    recycle_count = conn.execute("SELECT COUNT(*) as count FROM silos WHERE status = 'deleted'").fetchone()
    recycle_count = recycle_count['count'] if recycle_count else 0
    
    conn.close()
    return render_template('dashboard.html', silos=silo_data, total_silos=len(silo_data),
                          total_stock=round(total_stock/1000, 1), red_count=red_count,
                          yellow_count=yellow_count, green_count=green_count,
                          username=session['username'], role=session['role'],
                          recycle_count=recycle_count)

@app.route('/silo/<int:silo_id>', methods=['GET', 'POST'])
@login_required
def edit_silo(silo_id):
    if request.method == 'POST':
        grain_type = request.form['grain_type']
        moisture = float(request.form['moisture'])
        quantity = float(request.form['quantity'])
        entry_date = request.form['entry_date']
        farmer_id = request.form.get('farmer_id')
        
        conn = get_db()
        conn.execute("UPDATE silos SET grain_type = ?, current_stock_kg = current_stock_kg + ? WHERE id = ?", (grain_type, quantity, silo_id))
        batch_number = f"BATCH-{silo_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        conn.execute("INSERT INTO grain_batches (batch_number, silo_id, grain_type, quantity_kg, moisture, entry_date, farmer_id) VALUES (?, ?, ?, ?, ?, ?, ?)", (batch_number, silo_id, grain_type, quantity, moisture, entry_date, farmer_id))
        conn.execute("INSERT INTO transactions (silo_id, batch_id, transaction_type, quantity_kg, transaction_date, created_by) SELECT ?, id, 'IN', ?, ?, ? FROM grain_batches WHERE batch_number = ?", (silo_id, quantity, entry_date, session['user_id'], batch_number))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    
    conn = get_db()
    silo = conn.execute("SELECT * FROM silos WHERE id = ?", (silo_id,)).fetchone()
    farmers = conn.execute("SELECT id, name FROM farmers ORDER BY name").fetchall()
    conn.close()
    return render_template('edit_silo.html', silo=silo, farmers=farmers)

@app.route('/add_silo', methods=['POST'])
@login_required
@admin_required
def add_silo():
    data = request.get_json()
    conn = get_db()
    conn.execute("INSERT INTO silos (silo_number, location, capacity_kg) VALUES (?, ?, ?)", (data['silo_number'], data['location'], data['capacity_kg']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/remove_silo/<int:silo_id>', methods=['DELETE'])
@login_required
@admin_required
def remove_silo(silo_id):
    conn = get_db()
    conn.execute("UPDATE silos SET status = 'inactive' WHERE id = ?", (silo_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/farmers')
@login_required
def farmers():
    conn = get_db()
    farmers = conn.execute("SELECT f.*, COUNT(gb.id) as delivery_count FROM farmers f LEFT JOIN grain_batches gb ON f.id = gb.farmer_id GROUP BY f.id ORDER BY f.name").fetchall()
    conn.close()
    return render_template('farmers.html', farmers=farmers, role=session['role'])

@app.route('/add_farmer', methods=['POST'])
@login_required
def add_farmer():
    data = request.get_json()
    conn = get_db()
    conn.execute("INSERT INTO farmers (farmer_number, name, phone, email, location) VALUES (?, ?, ?, ?, ?)", (data['farmer_number'], data['name'], data['phone'], data.get('email', ''), data.get('location', '')))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/transactions')
@login_required
def transactions():
    conn = get_db()
    transactions = conn.execute("SELECT t.*, s.silo_number, gb.batch_number, u.username as created_by_name FROM transactions t JOIN silos s ON t.silo_id = s.id LEFT JOIN grain_batches gb ON t.batch_id = gb.id LEFT JOIN users u ON t.created_by = u.id ORDER BY t.created_at DESC LIMIT 100").fetchall()
    conn.close()
    return render_template('transactions.html', transactions=transactions)

@app.route('/remove_stock', methods=['POST'])
@login_required
def remove_stock():
    data = request.get_json()
    conn = get_db()
    silo = conn.execute("SELECT current_stock_kg FROM silos WHERE id = ?", (data['silo_id'],)).fetchone()
    if silo['current_stock_kg'] < data['quantity']:
        conn.close()
        return jsonify({"success": False, "error": "Insufficient stock"}), 400
    conn.execute("UPDATE silos SET current_stock_kg = current_stock_kg - ? WHERE id = ?", (data['quantity'], data['silo_id']))
    conn.execute("INSERT INTO transactions (silo_id, transaction_type, quantity_kg, transaction_date, notes, created_by) VALUES (?, 'OUT', ?, date('now'), ?, ?)", (data['silo_id'], data['quantity'], data.get('reason', ''), session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/reports')
@login_required
def reports():
    return render_template('reports.html')

@app.route('/export_pdf')
@login_required
def export_pdf():
    conn = get_db()
    silos = conn.execute("SELECT * FROM silos WHERE status = 'active'").fetchall()
    conn.close()
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    title = Paragraph("Silo Management Report", styles['Title'])
    elements.append(title)
    data = [['Silo', 'Location', 'Grain Type', 'Stock (kg)', 'Capacity (kg)']]
    for silo in silos:
        data.append([silo['silo_number'], silo['location'] or '-', silo['grain_type'] or '-', str(silo['current_stock_kg'] or 0), str(silo['capacity_kg'] or 0)])
    table = Table(data)
    table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), colors.grey), ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('GRID', (0,0), (-1,-1), 1, colors.black)]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='silo_report.pdf', mimetype='application/pdf')

@app.route('/export_csv')
@login_required
def export_csv():
    conn = get_db()
    silos = conn.execute("SELECT * FROM silos WHERE status = 'active'").fetchall()
    conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Silo Number', 'Location', 'Grain Type', 'Stock (kg)', 'Capacity (kg)'])
    for silo in silos:
        writer.writerow([silo['silo_number'], silo['location'] or '', silo['grain_type'] or '', silo['current_stock_kg'] or 0, silo['capacity_kg'] or 0])
    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()), as_attachment=True, download_name='silos.csv', mimetype='text/csv')

@app.route('/users')
@login_required
@admin_required
def users():
    conn = get_db()
    users = conn.execute("SELECT id, username, email, role, full_name, created_at FROM users").fetchall()
    conn.close()
    return render_template('users.html', users=users)

@app.route('/add_user', methods=['POST'])
@login_required
@admin_required
def add_user():
    data = request.get_json()
    is_strong, msg = is_strong_password(data['password'])
    if not is_strong:
        return jsonify({"success": False, "error": msg}), 400
    hashed = hash_password(data['password'])
    conn = get_db()
    try:
        conn.execute("INSERT INTO users (username, password, email, role, full_name) VALUES (?, ?, ?, ?, ?)", (data['username'], hashed, data.get('email', ''), data['role'], data.get('full_name', '')))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"success": False, "error": "Username already exists"}), 400
    conn.close()
    return jsonify({"success": True})

@app.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        current = request.form.get('current_password')
        new_pwd = request.form.get('new_password')
        confirm = request.form.get('confirm_password')
        if new_pwd != confirm:
            return render_template('change_password.html', error="Passwords do not match")
        is_strong, msg = is_strong_password(new_pwd)
        if not is_strong:
            return render_template('change_password.html', error=msg)
        conn = get_db()
        user = conn.execute("SELECT password FROM users WHERE id = ?", (session['user_id'],)).fetchone()
        if not verify_password(current, user['password']):
            conn.close()
            return render_template('change_password.html', error="Current password is incorrect")
        conn.execute("UPDATE users SET password = ? WHERE id = ?", (hash_password(new_pwd), session['user_id']))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    return render_template('change_password.html')

@app.route('/alert-settings', methods=['GET', 'POST'])
@login_required
def alert_settings():
    message = request.args.get('message')
    error = request.args.get('error')
    
    if request.method == 'POST':
        email = request.form.get('email')
        phone = request.form.get('phone')
        conn = get_db()
        conn.execute('UPDATE users SET email = ?, phone = ? WHERE id = ?', (email, phone, session['user_id']))
        conn.commit()
        conn.close()
        message = 'Settings saved!'
    
    conn = get_db()
    user = conn.execute('SELECT email, phone FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    conn.close()
    return render_template('alert_settings.html', user=user, message=message, error=error)

@app.route('/send-test-alert')
@login_required
def send_test_alert():
    conn = get_db()
    user = conn.execute('SELECT email FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    conn.close()
    
    if user and user['email']:
        if send_test_email(user['email']):
            return redirect(url_for('alert_settings', message='Test email sent successfully! Check your inbox.'))
        else:
            return redirect(url_for('alert_settings', error='Failed to send email. Check console for errors.'))
    else:
        return redirect(url_for('alert_settings', error='No email address configured. Please add your email in settings.'))

@app.route('/analytics')
@login_required
def analytics():
    conn = get_db()
    trends = conn.execute("SELECT date(entry_date) as date, AVG(moisture) as avg_moisture FROM grain_batches WHERE entry_date > date('now', '-30 days') GROUP BY date(entry_date) ORDER BY date").fetchall()
    silos = conn.execute("SELECT id FROM silos WHERE status = 'active'").fetchall()
    risk_counts = {'red': 0, 'yellow': 0, 'green': 0, 'gray': 0}
    for silo in silos:
        batch = conn.execute("SELECT moisture, entry_date FROM grain_batches WHERE silo_id = ? ORDER BY entry_date DESC LIMIT 1", (silo['id'],)).fetchone()
        if batch:
            try:
                days = (datetime.now() - datetime.strptime(batch['entry_date'], '%Y-%m-%d')).days
                color, _ = calculate_risk(batch['moisture'], days)
                risk_counts[color] = risk_counts.get(color, 0) + 1
            except:
                risk_counts['gray'] += 1
        else:
            risk_counts['gray'] += 1
    conn.close()
    return render_template('analytics.html', trends=trends, risk_counts=risk_counts)

# ========== RECYCLE BIN ROUTES ==========

@app.route('/silo/<int:silo_id>/delete', methods=['POST'])
@login_required
@admin_required
def soft_delete_silo(silo_id):
    """Move silo to recycle bin"""
    try:
        conn = get_db()
        silo = conn.execute("SELECT * FROM silos WHERE id = ? AND status = 'active'", (silo_id,)).fetchone()
        if not silo:
            conn.close()
            return jsonify({"success": False, "error": "Silo not found"}), 404
        
        if silo['current_stock_kg'] > 0:
            conn.close()
            return jsonify({"success": False, "error": "Cannot delete silo with stock. Remove stock first."}), 400
        
        conn.execute("""
            UPDATE silos 
            SET status = 'deleted', 
                deleted_at = datetime('now'),
                deleted_by = ?
            WHERE id = ?
        """, (session['user_id'], silo_id))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Silo moved to recycle bin"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/silo/<int:silo_id>/restore', methods=['POST'])
@login_required
@admin_required
def restore_silo(silo_id):
    """Restore silo from recycle bin"""
    try:
        conn = get_db()
        silo = conn.execute("SELECT * FROM silos WHERE id = ? AND status = 'deleted'", (silo_id,)).fetchone()
        if not silo:
            conn.close()
            return jsonify({"success": False, "error": "Silo not found in recycle bin"}), 404
        
        conn.execute("""
            UPDATE silos 
            SET status = 'active', 
                deleted_at = NULL,
                deleted_by = NULL
            WHERE id = ?
        """, (silo_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Silo restored successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/recycle-bin')
@login_required
@admin_required
def recycle_bin():
    """View all deleted silos"""
    conn = get_db()
    deleted_silos = conn.execute("""
        SELECT s.*, u.username as deleted_by_name
        FROM silos s
        LEFT JOIN users u ON s.deleted_by = u.id
        WHERE s.status = 'deleted'
        ORDER BY s.deleted_at DESC
    """).fetchall()
    conn.close()
    return render_template('recycle_bin.html', silos=deleted_silos)

@app.route('/silo/<int:silo_id>/permanent_delete', methods=['DELETE'])
@login_required
@admin_required
def permanent_delete_silo(silo_id):
    """Permanently delete silo from database"""
    try:
        conn = get_db()
        silo = conn.execute("SELECT * FROM silos WHERE id = ? AND status = 'deleted'", (silo_id,)).fetchone()
        if not silo:
            conn.close()
            return jsonify({"success": False, "error": "Silo not found in recycle bin"}), 404
        
        # Delete related records
        conn.execute("DELETE FROM grain_batches WHERE silo_id = ?", (silo_id,))
        conn.execute("DELETE FROM transactions WHERE silo_id = ?", (silo_id,))
        conn.execute("DELETE FROM alerts WHERE silo_id = ?", (silo_id,))
        conn.execute("DELETE FROM silos WHERE id = ?", (silo_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Silo permanently deleted"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/recycle-bin/empty', methods=['DELETE'])
@login_required
@admin_required
def empty_recycle_bin():
    """Empty the entire recycle bin"""
    try:
        conn = get_db()
        deleted = conn.execute("SELECT id FROM silos WHERE status = 'deleted'").fetchall()
        count = len(deleted)
        for silo in deleted:
            conn.execute("DELETE FROM grain_batches WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM transactions WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM alerts WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM silos WHERE id = ?", (silo['id'],))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Permanently deleted {count} silos"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/recycle-bin/auto-delete', methods=['POST'])
@login_required
@admin_required
def auto_delete_old():
    """Auto-delete silos older than 30 days"""
    try:
        conn = get_db()
        old = conn.execute("""
            SELECT id FROM silos 
            WHERE status = 'deleted' 
            AND deleted_at < datetime('now', '-30 days')
        """).fetchall()
        
        count = 0
        for silo in old:
            conn.execute("DELETE FROM grain_batches WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM transactions WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM alerts WHERE silo_id = ?", (silo['id'],))
            conn.execute("DELETE FROM silos WHERE id = ?", (silo['id'],))
            count += 1
        
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Auto-deleted {count} old silos"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ========== VERIFICATION ROUTES ==========
@app.route('/google8d9f89a8b245fc66.html')
def google_verify():
    return send_file('google8d9f89a8b245fc66.html')

@app.route('/sitemap.xml')
def sitemap():
    return send_file('sitemap.xml')

# ========== DELETE USER ROUTES ==========

@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_user(user_id):
    try:
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({"success": False, "error": "User not found"}), 404
        if user_id == session['user_id']:
            conn.close()
            return jsonify({"success": False, "error": "Cannot delete yourself"}), 403
        if user['role'] == 'admin':
            admin_count = conn.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").fetchone()
            if admin_count['count'] <= 1:
                conn.close()
                return jsonify({"success": False, "error": "Cannot delete last admin"}), 403
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/delete_users', methods=['DELETE'])
@login_required
@admin_required
def delete_users():
    try:
        data = request.get_json()
        user_ids = data.get('user_ids', [])
        if not user_ids:
            return jsonify({"success": False, "error": "No user IDs provided"}), 400
        
        conn = get_db()
        deleted_count = 0
        errors = []
        
        for user_id in user_ids:
            user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            if not user:
                errors.append(f"User ID {user_id} not found")
                continue
            
            if user_id == session['user_id']:
                errors.append(f"Cannot delete your own account (ID: {user_id})")
                continue
            
            if user['role'] == 'admin':
                admin_count = conn.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").fetchone()
                if admin_count['count'] <= 1:
                    errors.append(f"Cannot delete the last admin user (ID: {user_id})")
                    continue
            
            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            deleted_count += 1
        
        conn.commit()
        conn.close()
        
        if errors:
            return jsonify({
                "success": True,
                "deleted": deleted_count,
                "errors": errors,
                "message": f"Deleted {deleted_count} user(s). Errors: {', '.join(errors)}"
            })
        else:
            return jsonify({"success": True, "message": f"Successfully deleted {deleted_count} user(s)"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ========== INIT DATABASE ==========
def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS pending_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            preferred_username TEXT,
            requested_role TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Add deleted_at and deleted_by columns to silos if not exist
    try:
        conn.execute("ALTER TABLE silos ADD COLUMN deleted_at TIMESTAMP")
    except:
        pass
    try:
        conn.execute("ALTER TABLE silos ADD COLUMN deleted_by INTEGER")
    except:
        pass
    
    conn.commit()
    conn.close()

init_db()
@app.route('/delete_farmer/<int:farmer_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_farmer(farmer_id):
    try:
        conn = get_db()
        
        farmer = conn.execute("SELECT * FROM farmers WHERE id = ?", (farmer_id,)).fetchone()
        if not farmer:
            conn.close()
            return jsonify({"success": False, "error": "Farmer not found"}), 404
        
        batches = conn.execute("SELECT COUNT(*) as count FROM grain_batches WHERE farmer_id = ?", (farmer_id,)).fetchone()
        if batches['count'] > 0:
            conn.close()
            return jsonify({"success": False, "error": f"Cannot delete farmer with {batches['count']} grain batch(es)."}), 400
        
        conn.execute("DELETE FROM farmers WHERE id = ?", (farmer_id,))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Farmer deleted successfully"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)