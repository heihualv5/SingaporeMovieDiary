import requests
import json
from concurrent.futures import ThreadPoolExecutor,wait,ALL_COMPLETED
import time
def allMovies():
    try:
        response = requests.get(
            url="https://api.internationalshowtimes.com/v4/movies/",
            params={
                "countries": "SG",
            },
            headers={
                "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
        movieStr = str(response.content,'utf-8')
        moviejson=json.loads(movieStr)
        allMoviesJsonList=getAllMoviesinfo(moviejson)
        return json.dumps(allMoviesJsonList)
    except requests.exceptions.RequestException:
        print("error")

def searchMovie(id,time_from,time_to):
    #"2019-10-14T00:00:00+08:00"
    #"2019-10-15T00:00:00+08:00"
    url="https://api.internationalshowtimes.com/v4/showtimes?city_ids=20660&movie_id="+str(id)+"&time_from="+str(time_from)+"&time_to="+str(time_to)
    try:
        response = requests.get(
            url,
            params={
                "countries": "SG",
            },
            headers={
                "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
        str1 = str(response.content,'utf-8')
        json1=json.loads(str1)
        movieshows={'cinema':[{'cinemaid':'','time':[]}]}
        for js in json1['showtimes']:
            flag=False
            for cinema in movieshows['cinema']:
                if js['cinema_id'] == cinema['cinemaid']:
                    if js['start_at'] not in cinema['time']:
                        cinema['time'].append(js['start_at'])
                    flag=True;
                    break;
            if flag==False:
                movieshows['cinema'].append({'cinemaid':js['cinema_id'],'time':[]})
        movieshows['cinema'].remove(movieshows['cinema'][0])
        json2=json.dumps(movieshows)
        return(json2)
    except requests.exceptions.RequestException:
        print("error")
def searchMovie2(id,cinemaid,time_from,time_to):
    #"2019-10-14T00:00:00+08:00"
    #"2019-10-15T00:00:00+08:00"
    url="https://api.internationalshowtimes.com/v4/showtimes?city_ids=20660&movie_id="+str(id)+"&time_from="+str(time_from)+"&time_to="+str(time_to)+"&cinema_id="+str(cinemaid)
    try:
        response = requests.get(
            url,
            params={
                "countries": "SG",
            },
            headers={
                "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
        str1 = str(response.content,'utf-8')
        json1=json.loads(str1)
        movieshows={'cinema':[{'cinemaid':'','time':[]}]}
        for js in json1['showtimes']:
            flag=False
            for cinema in movieshows['cinema']:
                if js['cinema_id'] == cinema['cinemaid']:
                    if js['start_at'] not in cinema['time']:
                        cinema['time'].append(js['start_at'])
                    flag=True;
                    break;
            if flag==False:
                movieshows['cinema'].append({'cinemaid':js['cinema_id'],'time':[]})
        movieshows['cinema'].remove(movieshows['cinema'][0])
        json2=json.dumps(movieshows)
        return(json2)
    except requests.exceptions.RequestException:
        print("error")
def getAllMoviesinfo(moviejson):
    jsonList=[]
    urllist=[]
    index=len(moviejson['movies'])
    for movie in moviejson['movies']:
        id=movie['id']
        url="https://api.internationalshowtimes.com/v4/movies/"+str(id)
        urllist.append(url)
    try:
        with ThreadPoolExecutor(max_workers=index) as executor:
            result_iterators = executor.map(getMovieInfo,urllist)
        for result in result_iterators:
            jsonList.append(result)
        return jsonList
    except requests.exceptions.RequestException:
        print("error")

def getMovieInfo(url):
    response = requests.get(
        url,
        params={
            "countries": "SG",
        },
        headers={
            "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
    str1 = str(response.content,'utf-8')
    json1=json.loads(str1)
    return json1
def getMovieInfo2(id):
    response = requests.get(
        url="https://api.internationalshowtimes.com/v4/movies/"+str(id),
        params={
            "countries": "SG",
        },
        headers={
            "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
    str1 = str(response.content,'utf-8')
    json1=json.loads(str1)
    return json1
def allCinemas():
    url="https://api.internationalshowtimes.com/v4/cinemas/"
    response = requests.get(
        url,
        params={
            "countries": "SG",
        },
        headers={
            "X-API-Key": "kL60ps480N6XMj1xWxi4wjlrk38ijy1A",
            },
        )
    str1 = str(response.content,'utf-8')
    json1=json.loads(str1)
    return json1

