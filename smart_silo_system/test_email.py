from flask import Flask
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'kk3478787@gmail.com'
app.config['MAIL_PASSWORD'] = 'jlchktqssypctods'
app.config['MAIL_DEFAULT_SENDER'] = 'kk3478787@gmail.com'
mail = Mail(app)

with app.app_context():
    msg = Message('Test Email', recipients=['kelvinkemboi608@gmail.com'])
    msg.body = 'Test email from Smart Silo System'
    mail.send(msg)
    print('Email sent! Check your inbox/spam folder.')
