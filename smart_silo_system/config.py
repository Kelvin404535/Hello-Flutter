import os

class Config:
    SECRET_KEY = 'your-secret-key-change-this-to-something-random'
    
    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/silo_management.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email settings (update with your email)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'kelvinkemboi608@gmail.com'
    MAIL_PASSWORD = 'Kelvin@123'
    MAIL_DEFAULT_SENDER = 'kelvinkemboi608@gmail.com'
    
    # Admin credentials (these are defaults, change them)
    ADMIN_USERNAME = 'kelvinkemboi608@gmail.com'
    ADMIN_PASSWORD = 'Kelvin@123'
    ADMIN_EMAIL = 'kelvinkemboi608@gmail.com'