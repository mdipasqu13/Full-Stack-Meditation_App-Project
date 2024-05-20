from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy import DateTime, func

from config import db, bcrypt

# db = SQLAlchemy()
# bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    _password_hash = db.Column(db.String(60), nullable=False)

    def set_password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) < 4:
            raise ValueError("Username must be at least 4 characters long")
        return username
    
# relationships here
    sessions = db.relationship('Session', back_populates='user')


# serialize rules here

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
        
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) < 4:
            raise ValueError("Username must be at least 4 characters long")
        return username
        
class Meditation(db.Model, SerializerMixin):
    __tablename__ = 'meditations'
    id = db.Column(db.Integer, primary_key=True)
    meditation_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    duration = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    
    # relationships here
    sessions = db.relationship('Session', back_populates='meditation')
    categories = db.relationship('MeditationCategory', back_populates='meditation')
    # serialize rules here
    
    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Title cannot be empty")
        return title

    # @validates('description')
    # def validate_description(self, key, description):
    #     if not description:
    #         raise ValueError("Description cannot be empty")
    #     return description
    # let's see if I actually write descriptions for all

    @validates('duration')
    def validate_duration(self, key, duration):
        if not duration:
            raise ValueError("Duration cannot be empty")
        return duration

    @validates('audio_url')
    def validate_audio_url(self, key, audio_url):
        if not audio_url:
            raise ValueError("Audio URL cannot be empty")
        return audio_url
    
class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)
    journal_entry = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())
    # created_at = db.Column(DateTime, default=func.now()) unsure of proper syntax?
    # I think db.Integer is correct? This is the time stamp for the calendar. 
    
    # relationships here
    user = db.relationship('User', back_populates='sessions')
    meditation = db.relationship('Meditation', back_populates='sessions')
    # serialize rules here  
    
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    
    # relationships here
    meditation_categories = db.relationship('MeditationCategory', back_populates='category')

    # serialize rules here
    
class MeditationCategory(db.Model, SerializerMixin):
    __tablename__ = 'meditation_category'
    id = db.Column(db.Integer, primary_key=True)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    # relationships here
    meditation = db.relationship('Meditation', back_populates='categories')
    category = db.relationship('Category', back_populates='meditation_categories')

    # serialize rules here