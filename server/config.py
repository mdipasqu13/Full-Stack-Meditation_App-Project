from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_migrate import Migrate
import os
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy import MetaData


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})
# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# set a secret key for the app used for session management and security purposes
app.secret_key = os.urandom(24)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False



migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)


