import pymysql
from FlaskWebProject2 import userClass as uc
from FlaskWebProject2 import movieClass as mc
from FlaskWebProject2 import commentClass as cc
db = pymysql.connect("localhost","root","741953kK","sqltest" )
cursor = db.cursor()

def findUser(user_id,password):
    sql1="select * from sqltest.user where id = "+str(user_id)+" && Upassword = '"+str(password)+"'"
    cursor.execute(sql1)
    sqluser=cursor.fetchall()
    if(len(sqluser)>0):
        sql2="select * from sqltest.comment where user_id = '"+str(user_id)+"'"
        cursor.execute(sql2)
        sqlcomments=cursor.fetchall()
        comments=[]
        for i in range(0,len(sqlcomments)):
            temp=cc.comment(sqlcomments[i][0],sqlcomments[i][1],sqlcomments[i][2],[sqlcomments[i][3],sqlcomments[i][4]],sqlcomments[i][5],sqlcomments[i][6],sqlcomments[i][7],sqlcomments[i][8],sqlcomments[i][9],sqlcomments[i][10])
            comments.append(temp)
        user=uc.user(user_id,sqluser[0][1],comments)
        return user
    else:
        return -1
def addUser(name,password):
    cursor.execute("CREATE TABLE IF NOT EXISTS `sqltest`.`user` (`id` INT NOT NULL,`Uname` VARCHAR(45) NULL,`Upassword` VARCHAR(45) NULL,PRIMARY KEY (`id`));")
    sql1="select * from sqltest.user"
    cursor.execute(sql1)
    alluser=cursor.fetchall()
    id=len(alluser)
    id=id+1
    sql2="insert into sqltest.user(id,Uname,Upassword) values ("+str(id)+",'"+str(name)+"','"+str(password)+"')"
    cursor.execute(sql2)
    db.commit()
    user=findUser(id,password)
    return user
def findMovieComments(imdb_id):
    sql1="select * from sqltest.comment where imdb_id = '"+str(imdb_id)+"'"
    cursor.execute(sql1)
    sqlcomments=cursor.fetchall()
    if len(sqlcomments)==0:
        return -1
    else:
        comments=[]
        for i in range(0,len(sqlcomments)):
            temp=cc.comment(sqlcomments[i][0],sqlcomments[i][1],sqlcomments[i][2],[sqlcomments[i][3],sqlcomments[i][4]],sqlcomments[i][5],sqlcomments[i][6],sqlcomments[i][7],sqlcomments[i][8],sqlcomments[i][9],sqlcomments[i][10])
            comments.append(temp)
        return comments
def addComment(comment):
    cursor.execute("CREATE TABLE IF NOT EXISTS `sqltest`.`comment` (`id` INT NOT NULL,`user_id` INT NULL,`user_name` VARCHAR(45) NULL,`imdb_id` VARCHAR(45) NULL,`movie_name` VARCHAR(45) NULL,`lon` DOUBLE NULL,`lat` DOUBLE NULL,`rate` INT NULL,`context` VARCHAR(45) NULL,`cinema` VARCHAR(45) NULL,`time` VARCHAR(45) NULL,PRIMARY KEY (`id`));")
    Comment_ID=comment._comment__Comment_ID
    User_ID=comment._comment__User_ID
    User_Name=comment._comment__User_Name
    IMDB_ID=comment._comment__IMDB_ID
    Movie_Name=comment._comment__Movie_Name
    Location=comment._comment__Location
    Rate=comment._comment__Rate
    Context=comment._comment__Context
    Cinema=comment._comment__Cinema
    Time=comment._comment__Time
    lon=Location[0]
    lat=Location[1]
    sql1="INSERT INTO sqltest.comment (id, user_id, user_name, imdb_id,movie_name, lon, lat, rate, context, cinema, time) VALUES ('"+str(Comment_ID)+"', '"+str(User_ID)+"', '"+str(User_Name)+"', '"+str(IMDB_ID)+"', '"+str(Movie_Name)+"', '"+str(lon)+"', '"+str(lat)+"', '"+str(Rate)+"', '"+str(Context)+"', '"+str(Cinema)+"', '"+str(Time)+"');"
    cursor.execute(sql1)
    db.commit()
def getNewCommentID():
    sql1="select count( *) from sqltest.comment"
    cursor.execute(sql1)
    sqlcount=cursor.fetchall()
    id=int(sqlcount[0][0])+1
    return id
