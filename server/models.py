from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable =False)
    _password_hash = db.Column(db.String, nullable=False)
    
# relationships here

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
        
class Meditation(db.Model, SerializerMixin):
    __tablename__ = 'meditations'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    duration = db.Column(db.String)
    audio_url = db.Column(db.String)
    
    # relationships here

    # serialize rules here
    
class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)
    journal_entry = db.Column(db.String)
    created_at = db.Column(db.Integer) 
    # I think db.Integer is correct? This is the time stamp for the calendar. 
    
    # relationships here

    # serialize rules here  
    
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    
    # relationships here

    # serialize rules here
    
class MeditationCategory(db.Model, SerializerMixin):
    __tablename__ = 'meditation_category'
    id = db.Column(db.Integer, primary_key=True)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditations.id'), nullable=False)

    # relationships here

    # serialize rules here