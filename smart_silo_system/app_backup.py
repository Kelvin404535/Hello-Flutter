from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_file
import sqlite3
import hashlib
import secrets
import re
from datetime import datetime, timedelta
from functools import wraps
import io
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# Email and SMS Libraries
from flask_mail import Mail, Message
from twilio.rest import Client

app = Flask(__name__)

# ========== SECURITY CONFIGURATION ==========
app.secret_key = 'smart_silo_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# ========== EMAIL CONFIGURATION (Update these!) ==========
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'kk3478787@gmail.com'  # CHANGE THIS
app.config['MAIL_PASSWORD'] = 'jlchktqssypctods'     # CHANGE THIS
app.config['MAIL_DEFAULT_SENDER'] = 'kelvinkemboi608@gmail.com'

mail = Mail(app)

# ========== SMS CONFIGURATION (Optional - Update if using Twilio) ==========
TWILIO_ACCOUNT_SID = 'your_account_sid'      # CHANGE THIS
TWILIO_AUTH_TOKEN = 'your_auth_token'        # CHANGE THIS
TWILIO_PHONE_NUMBER = '+1234567890'          # CHANGE THIS

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) if TWILIO_ACCOUNT_SID != 'your_account_sid' else None

DB_PATH = 'instance/silo_management.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ========== ALERT FUNCTIONS ==========
def send_email_alert(recipient_email, subject, html_content):
    try:
        msg = Message(subject, recipients=[recipient_email])
        msg.html = html_content
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def send_sms_alert(phone_number, message):
    try:
        if twilio_client:
            twilio_client.messages.create(
                body=message[:160],
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return True
    except Exception as e:
        print(f"SMS error: {e}")
    return False

# ========== PASSWORD FUNCTIONS ==========
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
    salt = "smart_silo_salt_2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(password, hashed):
    salt = "smart_silo_salt_2026"
    return hashlib.sha256((password + salt).encode()).hexdigest() == hashed

# ========== ACCOUNT LOCKOUT ==========
failed_attempts = {}
locked_accounts = {}

def check_account_lockout(username):
    if username in locked_accounts:
        if datetime.now() < locked_accounts[username]:
            return True, f"Account locked until {locked_accounts[username].strftime('%H:%M:%S')}"
        else:
            del locked_accounts[username]
            del failed_attempts[username]
    return False, None

def record_failed_attempt(username):
    failed_attempts[username] = failed_attempts.get(username, 0) + 1
    if failed_attempts[username] >= 5:
        locked_accounts[username] = datetime.now() + timedelta(minutes=15)

def reset_failed_attempts(username):
    if username in failed_attempts:
        del failed_attempts[username]
    if username in locked_accounts:
        del locked_accounts[username]

# ========== DECORATORS ==========
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

# ========== RISK CALCULATION ==========
def calculate_risk(moisture, days_stored):
    if moisture is None or moisture == 0:
        return 'gray', 'No data entered'
    if moisture > 14 or days_stored > 90:
        return 'red', f'CRITICAL: {moisture}% moisture, {days_stored} days'
    elif moisture > 12.5 or days_stored > 60:
        return 'yellow', f'WARNING: {moisture}% moisture, {days_stored} days'
    else:
        return 'green', f'SAFE: {moisture}% moisture, {days_stored} days'

# ========== ROUTES ==========
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        is_locked, lock_msg = check_account_lockout(username)
        if is_locked:
            return render_template('login.html', error=lock_msg)
        
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        
        if user and verify_password(password, user['password']):
            reset_failed_attempts(username)
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            session.permanent = True
            return redirect(url_for('dashboard'))
        else:
            record_failed_attempt(username)
            return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db()
    silos = conn.execute("""
        SELECT s.*, COALESCE((SELECT moisture FROM grain_batches WHERE silo_id = s.id ORDER BY entry_date DESC LIMIT 1), 0) as moisture
        FROM silos s WHERE s.status = 'active' ORDER BY s.silo_number
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
    
    conn.close()
    return render_template('dashboard.html', silos=silo_data, total_silos=len(silo_data),
                          total_stock=round(total_stock/1000, 1), red_count=red_count,
                          yellow_count=yellow_count, green_count=green_count,
                          username=session['username'], role=session['role'])

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
    message = None
    if request.method == 'POST':
        email = request.form.get('email')
        phone = request.form.get('phone')
        conn = get_db()
        conn.execute('UPDATE users SET email = ?, phone = ? WHERE id = ?', (email, phone, session['user_id']))
        conn.commit()
        conn.close()
        message = 'Settings saved successfully!'
    
    conn = get_db()
    user = conn.execute('SELECT email, phone FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    conn.close()
    return render_template('alert_settings.html', user=user, message=message)

@app.route('/send-test-alert')
@login_required
def send_test_alert():
    conn = get_db()
    user = conn.execute('SELECT email, phone FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    conn.close()
    
    if user and user['email']:
        msg = Message('Test Alert', recipients=[user['email']])
        msg.html = '<h2>Test Alert</h2><p>Your Smart Silo alert system is working correctly!</p>'
        mail.send(msg)
    
    if user and user['phone'] and twilio_client:
        send_sms_alert(user['phone'], 'Test SMS: Your Smart Silo alert system is working!')
    
    return redirect(url_for('alert_settings'))

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)