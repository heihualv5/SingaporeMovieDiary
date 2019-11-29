from FlaskWebProject2 import commentClass
import json
class movie:
    __IMDB_ID=''
    __Poster=''
    __Name=''
    __Info=''
    __Comments=[]
    def __init__(self, imdb_id, poster, name, info, comments):
        self.__IMDB_ID=imdb_id
        self.__Poster=poster
        self.__Name=name
        self.__Info=info
        self.__Comments=comments
    def addcomment(self,comment):
        self.__Comments.append(comment)
    def toJson(self):
        movieJson=json.dumps(self,default=lambda obj: obj.__dict__,sort_keys=True,indent=4)
        return movieJson