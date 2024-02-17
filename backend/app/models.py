from datetime import datetime, timedelta
from . import db, login_manager
import base64
import os
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

bcrypt = Bcrypt()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(25), nullable=False, unique=True)
    highscore = db.Column(db.String(5), nullable=True)
    password = db.Column(db.String(60), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.get_token()
        self.save()

    def check_password(self, plain_text_password):
        return bcrypt.check_password_hash(self.password, plain_text_password)

    def get_token(self):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(minutes=1):
            return self.token
        self.token = base64.b64encode(os.urandom(24)).decode("utf-8")
        self.token_expiration = now + timedelta(hours=1)
        self.save()
        return self.token
    
    def is_token_valid(self):
        return self.token_expiration > datetime.utcnow()

    def to_dict(self): return { "id": self.id, "username": self.username, "email": self.email, "created": self.created }

    def delete_user(self):
        db.session.delete(self)
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))