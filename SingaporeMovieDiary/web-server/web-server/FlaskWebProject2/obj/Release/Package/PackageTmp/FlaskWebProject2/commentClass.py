import json
class comment:
    __Comment_ID=-1
    __User_ID=-1
    __User_Name=''
    __IMDB_ID=''
    __Movie_Name=''
    __Location=[-1,-1]
    __Rate__=-1
    __Context=''
    __Cinema=''
    __Time=''
    def __init__(self,comment_id, user_id,user_name, imdb_id,movie_name,location, rate, context, cinema, time):
        self.__Comment_ID=comment_id
        self.__User_ID=user_id
        self.__User_Name=user_name
        self.__IMDB_ID=imdb_id
        self.__Movie_Name=movie_name
        self.__Location=location
        self.__Rate=rate
        self.__Context=context
        self.__Cinema=cinema
        self.__Time=time
    def toJson(self):
        commentJson=json.dumps(self,default=lambda obj: obj.__dict__,sort_keys=True,indent=4)
        return commentJson

