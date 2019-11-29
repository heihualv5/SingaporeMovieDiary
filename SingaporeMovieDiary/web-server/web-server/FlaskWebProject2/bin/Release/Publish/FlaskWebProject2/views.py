"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import request
import json
from FlaskWebProject2 import app
from FlaskWebProject2 import database_control
from FlaskWebProject2 import API_control


@app.route('/', methods=['GET'])
def hello():
    return "Hello World!"
@app.route('/signin', methods=['POST'])
def signin():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            user=database_control.findUser(data['User_ID'],data['Password'])
            if user==-1:
                return json.dump('fail')
            return user.toJson()
        except:
            return('error')
@app.route('/signup', methods=['POST'])
def signup():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            user=database_control.addUser(data['Name'],data['Password'])
            return user.toJson()
        except:
            return('error') 
@app.route('/allmovies',methods=['GET'])
def allmovies():
    if request.method=='GET':
        try:
            moviesinfo=API_control.allMovies()
            return moviesinfo
        except:
            return('error')
@app.route('/getshowtime', methods=['POST'])
def getshowtime():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            id=data['id']
            from_time=data['from_time']
            to_time=data['to_time']
            movieshowtime=API_control.searchMovie(id,from_time,to_time)
            return movieshowtime
        except:
            return('error')
@app.route('/getshowtimebycinema', methods=['POST'])
def getshowtimebycinema():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            id=data['id']
            cinemaid=data['cinemaid']
            from_time=data['from_time']
            to_time=data['to_time']
            movieshowtime=API_control.searchMovie2(id,cinemaid,from_time,to_time)
            return movieshowtime
        except:
            return('error')
@app.route('/getallcinema', methods=['GET'])
def getallcinema():
    if request.method=='GET':
        try:
            cinemasinfo=API_control.allCinemas()
            return json.dumps(cinemasinfo)
        except:
                return('error')
@app.route('/getmovie', methods=['POST'])
def getmovie():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            imdb_id=data['IMDB_ID']
            id=data['id']
            comments=database_control.findMovieComments(imdb_id)
            movieinfo=API_control.getMovieInfo2(id)
            for i in range(4,0,-1):
                if movieinfo['movie']['poster_image']['image_files'][i]['url']:
                    poster=movieinfo['movie']['poster_image']['image_files'][i]['url']
            movie=database_control.mc.movie(imdb_id,poster,movieinfo['movie']['title'],movieinfo['movie'],comments)
            return movie.toJson()
        except:
            return('error')
@app.route('/addcomment', methods=['POST'])
def addcomment():
    if request.method=='POST':
        try:
            jsdata = request.get_data(as_text=True)
            data=json.loads(jsdata)
            comment_id=database_control.getNewCommentID()
            user_id=data['User_ID']
            user_name=data['User_Name']
            imdb_id=data['IMDB_ID']
            movie_name=data['Movie_Name']
            location=data['Location']
            rate=data['Rate']
            context=data['Context']
            cinema=data['Cinema']
            time=data['Time']
            comment=database_control.cc.comment(comment_id,user_id,user_name,imdb_id,movie_name,location, rate, context, cinema, time)
            try:
                database_control.addComment(comment)
                return 'succeed'
            except:
                return 'fail'
        except:
            return('error')



    

