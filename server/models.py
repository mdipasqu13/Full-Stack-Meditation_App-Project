from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy import DateTime, func
from datetime import datetime
import pytz

from config import db, bcrypt


# Define User model
# Methods for setting password hash and checking password
class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True) 
    _password_hash = db.Column(db.String(60), nullable=False)

    def set_password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    # validations for username, can't be empty and must be at least 4 characters long
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) < 4:
            raise ValueError("Username must be at least 4 characters long")
        return username
    
    sessions = db.relationship('Session', back_populates='user', cascade='all, delete')
    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete')


    serialize_rules = ('-sessions.user', '-sessions.meditation')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8')) #encrypt passed in password
        self._password_hash = password_hash.decode('utf-8') #set private attribute to decoded password
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8') #check to see if encrypted password match
        )
# define Meditation model
class Meditation(db.Model, SerializerMixin):
    __tablename__ = 'meditations'
    id = db.Column(db.Integer, primary_key=True)
    meditation_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    duration = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=True)
    category = db.Column(db.String, nullable=True)
    
    sessions = db.relationship('Session', back_populates='meditation')
    favorites = db.relationship('Favorite', back_populates='meditation', cascade='all, delete')
    favorites = db.relationship('Favorite', back_populates='meditation')


    serialize_rules = ('-sessions.user', '-sessions.meditation', '-categories.meditation')
    # requires 'title' to exist and not be empty
    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Title cannot be empty")
        return title
    # requires 'duration' to exist and not be empty
    @validates('duration')
    def validate_duration(self, key, duration):
        if not duration:
            raise ValueError("Duration cannot be empty")
        return duration
    # requires 'audio_url' to exist and not be empty
    @validates('audio_url')
    def validate_audio_url(self, key, audio_url):
        if not audio_url:
            raise ValueError("Audio URL cannot be empty")
        return audio_url
    
# define Session model
class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)
    journal_entry = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=True)

    
    user = db.relationship('User', back_populates='sessions')
    meditation = db.relationship('Meditation', back_populates='sessions')
    serialize_rules = ('-user.sessions', '-meditation.sessions')
    # convert session to dictionary with timezone conversion
    def to_dict(self):
        eastern = pytz.timezone('America/New_York')
        created_at_eastern = self.created_at.astimezone(eastern)
        return {
            'id': self.id,
            'user_id': self.user_id,
            'meditation_id': self.meditation_id,
            'journal_entry': self.journal_entry,
            'created_at': created_at_eastern.isoformat()
        }
# define Favorite model  
class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)

    user = db.relationship('User', back_populates='favorites')
    meditation = db.relationship('Meditation', back_populates='favorites')

    serialize_rules = ('-user.favorites', '-meditation.favorites')
    # convert favorite to dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'meditation_id': self.meditation_id,
        }
