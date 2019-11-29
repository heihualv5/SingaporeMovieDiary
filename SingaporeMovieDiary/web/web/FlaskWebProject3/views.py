"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from FlaskWebProject3 import app

@app.route('/')
def home():
     return app.send_static_file("page1.html")

