"""
This script runs the FlaskWebProject2 application using a development server.
"""

from os import environ
from FlaskWebProject2 import app

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000)
