from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config
from flask_migrate import Migrate 



app = Flask(__name__)
CORS(app, origins="http://localhost:5173")
app.config.from_object(Config)
app.config['SECRET_KEY'] = 'my_secret_key'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
migrate = Migrate(app, db)

from . import routes, models