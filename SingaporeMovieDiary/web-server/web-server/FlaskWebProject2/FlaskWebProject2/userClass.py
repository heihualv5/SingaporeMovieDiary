from FlaskWebProject2 import commentClass
import json
class user:
    __User_ID=-1
    __Name=''
    __Comments=[]
    def __init__(self, user_id, name, comments):
        self.__User_ID=user_id
        self.__Name=name
        self.__Comments=comments
    def addcomment(self,comment):
        self.__Comments.append(comment)
    def toJson(self):
        userJson=json.dumps(self,default=lambda obj: obj.__dict__,sort_keys=True,indent=4)
        return userJson
