"""
The flask application package.
"""

from flask import Flask
app = Flask(__name__,static_url_path='',static_folder="template")

import FlaskWebProject3.views
