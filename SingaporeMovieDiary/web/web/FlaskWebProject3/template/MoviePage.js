var SelectedCinemaName = JSON.parse(sessionStorage.getItem("cinema"));
var MovieInformation = sessionStorage.getItem("info");
var MovieInfoArray = MovieInformation.split("Cinema");
var SelectedShowTime = MovieInfoArray[0];
var SelectedMovieID = MovieInfoArray[1];
var SelectedMovieIMDB = MovieInfoArray[4];
console.log(MovieInformation);
$.ajaxSettings.async = false;
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpemhvbmd6IiwiYSI6ImNrMXoza3oyejB0eW4zZGwyYWVydWcxMWQifQ.dPJrQVdfgHaDpb1A2b50mw';

var map = new mapboxgl.Map({
    container: 'map2',
    minZoom: '10',
    maxZoom: '15',
    center: [103.819839,1.352083],
    style: 'mapbox://styles/huizhongz/ck1z3ngn50u4f1cnankzh4ni1',
});

var returnstring=function(str){
    var returnedString=str.replace(/\+/g," ");
    return returnedString
}


var GetCommentGeoJSON=function(moviecomments){
    var lonlat=[]
    var commentids=[]
    for(i=0;i<moviecomments.length;i++){
        lonlat.push(moviecomments[i]['_comment__Location']);
        commentids.push(moviecomments[i]['_comment__Comment_ID']);
    }
    var comment_latlon="";
    for(i=0;i<moviecomments.length;i++){
        if(i < moviecomments.length-1){
            comment_latlon += '{"type":"Feature","id":'+ Number(commentids[i])+',"geometry": {"type":"Point","coordinates":['+lonlat[i].toString()+']}},';
        }else {
            comment_latlon += '{"type":"Feature","id":'+ Number(commentids[i])+',"geometry": {"type":"Point","coordinates":['+lonlat[i].toString()+']}}';
        }
    }
    var comment_latlon_string='{"type": "geojson","data":{"type": "FeatureCollection","features":['+comment_latlon+']}}'
    var comment_latlonJSON = JSON.parse(comment_latlon_string);
    return comment_latlonJSON;
}

var loadmap=function(comment_latlonJSON){
    map.addSource("comments",comment_latlonJSON)
    map.loadImage('./img/normal.png', function(error, image) {
        if (error) throw error;
        map.addImage('normal', image);
        map.addLayer({
            "id": "normalP",
            "type": "symbol",
            "source": "comments",
            "layout": {
                "icon-allow-overlap":true,
                "icon-image": "normal",
                "icon-size": 0.1
            },
            "paint":{
                "icon-opacity": 1
            }});
    });
    map.loadImage('./img/highlight.png', function(error, image) {
        if (error) throw error;
        map.addImage('highlight', image);
        map.addLayer({
            "id": "highlightP",
            "type": "symbol",
            "source": "comments",
            "layout": {
                "icon-allow-overlap":true,
                "icon-image": "highlight",
                "icon-size": 0.1
            },
            "paint":{
                "icon-opacity": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1,
                    0.00001
                ],
            }});
    });
}

var showcomments=function (moviecomments,type) {
    if(type=="movie"){
        for(i=0;i<moviecomments.length;i++){
            var commentsid=moviecomments[i]["_comment__Comment_ID"];
            var commentsusername = moviecomments[i]["_comment__User_Name"];
            var commentstime = moviecomments[i]["_comment__Time"];
            var cTime = commentstime.split("T");
            var cTime1 = cTime[0];
            var cTime2 = cTime[1].split("+");
            var cTimeOnScreen = cTime2[0];
            var commentsrate = moviecomments[i]["_comment__Rate"];
            var commentscontext = returnstring(moviecomments[i]["_comment__Context"]);
            document.getElementById("comments2").innerHTML+='<div class='+'moviecomment'+' id='+commentsid+'><div id="Username">User name: '+commentsusername+'&nbsp;&nbsp;&nbsp;Rate: '+commentsrate+'</div><br><div id="context">'+commentscontext+'</div><div id="Movietime"><br>Movie time: '+cTimeOnScreen +", "+cTime1+'</div></div><div id="space"><br><br></div>'
        }
        var movieComments=document.getElementsByClassName('moviecomment');
        for(i=0;i<movieComments.length;i++){
            movieComments[i].addEventListener('mouseenter',function(e){
                var commentid=e.target.id
                map.setFeatureState({source: "comments",id: commentid},{hover: true});
            })
            movieComments[i].addEventListener('mouseleave',function(e){
                var commentid=e.target.id
                map.setFeatureState({source: "comments",id: commentid},{hover: false});
            })
        }

    }else if(type=="user"){
        for(i=0;i<moviecomments.length;i++){
            var commentsmoviename = moviecomments[i]["_comment__Movie_Name"];
            var commentstime = moviecomments[i]["_comment__Time"];
            var cTime = commentstime.split("T");
            var cTime1 = cTime[0];
            var cTime2 = cTime[1].split("+");
            var cTimeOnScreen = cTime2[0];
            var commentsrate = moviecomments[i]["_comment__Rate"];
            var commentscontext = returnstring(moviecomments[i]["_comment__Context"]);
            document.getElementById("comments2").innerHTML+='<div class='+'usercomment'+' id='+commentsid+'><div id="Moviename">Movie name: '+commentsmoviename+'&nbsp;&nbsp;&nbsp;Rate: '+commentsrate+'</div><br><div id="context">'+commentscontext+'</div><div id="Movietime"><br>Movie time: '+cTimeOnScreen +", "+cTime1+'</div></div><div id="space"><br><br></div>'
        }
        var userComments=document.getElementsByClassName('usercomment');
        console.log(userComments)
        for(i=0;i<userComments.length;i++){
            userComments[i].addEventListener('mouseenter',function(e){
                var commentid=e.target.id
                map.setFeatureState({source: "comments",id: commentid},{hover: true});
            })
            userComments[i].addEventListener('mouseleave',function(e){
                var commentid=e.target.id
                map.setFeatureState({source: "comments",id: commentid},{hover: false});
            })
        }
    }
}

$.post("http://www.singaporemovies.xyz:8000/getmovie",
    JSON.stringify({
        "IMDB_ID": SelectedMovieIMDB,
        "id": SelectedMovieID
    }),function(data) {
        var Moviejson = JSON.parse(data);
        var moviecomments = Moviejson["_movie__Comments"];
        var movieinfo = Moviejson["_movie__Info"];
        var moviename = returnstring(Moviejson["_movie__Name"]);
        var age_limits = movieinfo["age_limits"]["US"];
        var tmdb_value = movieinfo["ratings"]["tmdb"]["value"];
        var runtime = movieinfo["runtime"];
        for(i=0; i<2; i++){
            var cast_name = movieinfo["cast"][i]["name"];
        }
        sessionStorage.setItem("moviename",moviename);
        console.log(Moviejson);
        if(moviecomments == "-1"){
            document.getElementById("comments2").innerHTML +='<div style="color: white;padding-left: 5%;padding-top: 2%">No comments</div>';
        }
        else{
            var json1=GetCommentGeoJSON(moviecomments);
            map.on('load',function () {
                loadmap(json1);
            })
            showcomments(moviecomments,"movie");
        }
        var ShowTime = SelectedShowTime.split("T");
        var ShowTime1 = ShowTime[0].split('"')[1];
        var ShowTime2 = ShowTime[1].split("+");
        var ShowTimeOnScreen = ShowTime2[0];
        var genreslist = movieinfo["genres"];
        var genres="";
        for (j=0; j<genreslist.length; j++){
            var genresit = genreslist[j]["name"] +"; ";
            genres += genresit;
        };
        document.getElementById("movieinfo2").innerHTML = '<div id="moviename">' + moviename + '</div><div id="movieinfo">' +
            '                                                        <div id="genres"><br> Genres: ' + genres + '</div>' +
            '                                                        <div id="runtime"> Runtime: '+ runtime +'</div><div id="age_limits">Age limits: '+ age_limits +'</div>' +
            '                                                        <div id="tmdb_value"> TMDB rate: '+ tmdb_value +'</div>' +
            '                                                        <div id="cast_name"> Cast name: '+ cast_name +'</div></div>' +
            '                                                        <div id="synopsis"><br> Synopsis: ' + movieinfo["synopsis"] + '</div>' +
            '                                                        <div id="cinema"><br><br>&nbsp;&nbsp;&nbsp;The movie you chose is going to show at '+ SelectedCinemaName +" at "+ ShowTimeOnScreen + ", "+ ShowTime1+".</div>";
        document.getElementById("poster2").innerHTML = "<img src="+ Moviejson['_movie__Poster'] + ">";
})

function btnreturn2() {
    window.location.href = "page1.html";
    $("#loadinghide").show();
    $("#gif").show();
}

function btnreview2() {
    window.location.href = "page3.html";
}