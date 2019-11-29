var SignInBool = false;
var User = sessionStorage.getItem("user");
if (User){
    SignInBool = true;
    document.getElementById("signin")
        .style.display= "none";
    document.getElementById("signup")
        .style.display= "none";
    document.getElementById("myprofile")
        .style.display= "";
    document.getElementById("signout")
        .style.display= "";
}
MovieArray = [];
CinemaArray = [];

var info=sessionStorage.getItem("info")
if(info){
    sessionStorage.removeItem("info")
    sessionStorage.removeItem("cinema")
}

var moviename=sessionStorage.getItem("moviename")
if(moviename){
    sessionStorage.removeItem("moviename")
}

var PageIndex = 1;

$.ajaxSettings.async = false;

var moviedata=sessionStorage.getItem("allmovie")
if(moviedata){
    var MovieInfo=JSON.parse(moviedata);
    for (i = 0; i < MovieInfo.length; i++) {
        var Movieit = MovieInfo[i]
        var Movie = Movieit["movie"]
        var name = Movie["title"]
        var id = Movie["id"]
        var imdb_id = Movie["imdb_id"]
        var poster = Movie["poster_image_thumbnail"]
        var genreslist = Movie["genres"]
        var genres ="";
        for (j=0; j<genreslist.length; j++){
            var genresit = genreslist[j]["name"] +"; ";
            genres += genresit;
        }
        var synopsis = Movie["synopsis"]

        if (poster == null) {
            poster = "./img/poster.jpg";
        }
        var movieitem = new Array(id, poster, name, genres, synopsis, imdb_id);
        if (name != null) {
            MovieArray.push(movieitem);
        }}
}
else {
    $.getJSON('http://www.singaporemovies.xyz:8000/allmovies',
        function(data) {
            console.log(data);
            var MovieInfo = data;
            sessionStorage.setItem("allmovie",JSON.stringify(MovieInfo));
            for (i = 0; i < MovieInfo.length; i++) {
                var Movieit = MovieInfo[i]
                var Movie = Movieit["movie"]
                var name = Movie["title"]
                var id = Movie["id"]
                var imdb_id = Movie["imdb_id"]
                var poster = Movie["poster_image_thumbnail"]
                var genreslist = Movie["genres"]
                var genres ="";
                for (j=0; j<genreslist.length; j++){
                    var genresit = genreslist[j]["name"] +"; ";
                    genres += genresit;
                }
                var synopsis = Movie["synopsis"]

                if (poster == null) {
                    poster = "./img/poster.jpg";
                }
                var movieitem = new Array(id, poster, name, genres, synopsis, imdb_id);
                if (name != null) {
                    MovieArray.push(movieitem);
                }}
        })
}


$.getJSON('http://www.singaporemovies.xyz:8000/getallcinema',
    function(data) {
        console.log(data);
        var CinemaList = data["cinemas"];
        for (i = 0; i < CinemaList.length; i++) {
            var CinemaIt = CinemaList[i]
            var cinema_location = CinemaIt["location"]
            var cinemaitem = {
                "cinema_id": CinemaIt["id"],
                "cinema_name": CinemaIt["name"],
                "cinema_lon": cinema_location["lon"],
                "cinema_lat": cinema_location["lat"]
            };
            CinemaArray.push(cinemaitem);
        }})
//$.ajaxSettings.async = true;

//get Mapbox Layer//
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpemhvbmd6IiwiYSI6ImNrMXoza3oyejB0eW4zZGwyYWVydWcxMWQifQ.dPJrQVdfgHaDpb1A2b50mw';
var map = new mapboxgl.Map({
    container: 'map1',
    minZoom: '11',
    maxZoom: '15',
    center: [103.819839,1.352083],
    style: 'mapbox://styles/huizhongz/ck1z3ngn50u4f1cnankzh4ni1',
});

$("#loadinghide").hide();
$("#gif").hide();

var MovieNum = MovieArray.length;
var MoviesPages = Math.ceil(MovieNum/10);

for(j=1;j<MoviesPages;j++){
    document.getElementById("pagenumber").innerHTML += '<a class ="moviespage" id = '+ j +'>'+ j +'</a>';
}

for(i=1;i<10;i++){
    var k=10*(PageIndex-1)+i-1;
    var movieid= "movie" + k;
    var cinemaid = movieid+"_";
    var timeid = movieid+"__";
    document.getElementById("movieinfo").innerHTML+= '<div class="newmoviediv" id=' + movieid +'>' +
        '<div class="posterdiv"><img src='+MovieArray[k][1]+'></div>' +
        '<div class="infodiv">'+MovieArray[k][2]+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ MovieArray[k][3] +'<br><br>'+ MovieArray[k][4] +'</div>' +
        '</div>';
    }

var as = document.getElementsByTagName("a");
for(i = 0; i<as.length; i++){
    as[i].addEventListener("click", clicka);
}

function clicka(){
    PageIndex = Number(jQuery(this).attr("id"));
    document.getElementById("movieinfo").innerHTML="";
    if (PageIndex < MoviesPages) {
        for(i=1;i<10;i++){
            var k=10*(PageIndex-1)+i-1;
            var movieid="movie"+ k;
            var cinemaid = movieid+"_";
            var timeid = movieid+"__";
            document.getElementById("movieinfo").innerHTML+= '<div class="newmoviediv" id='+ movieid+'>' +
                '<div class="posterdiv"><img src='+MovieArray[k][1]+'></div>' +
                '<div class="infodiv">'+MovieArray[k][2]+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ MovieArray[k][3] +'<br><br>'+ MovieArray[k][4] +'</div>' +
                '</div>';
        }}
    else {
        var FinalPageIndex = MovieNum%10;
        for (i=1;i<FinalPageIndex;i++) {
            var k=10*(PageIndex-1)+i;
            var movieid="movie"+ k;
            var cinemaid = movieid+"_";
            var timeid = movieid+"__";
            document.getElementById("movieinfo").innerHTML+= '<div class="newmoviediv" id='+movieid+'>' +
                '<div class="posterdiv"><img src='+MovieArray[k][1]+'></div>' +
                '<div class="infodiv">'+MovieArray[k][2]+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+MovieArray[k][3]+'<br><br>'+MovieArray[k][4]+'</div>' +
                '</div>';
        }}

    var newmoviedivs = document.getElementsByClassName("newmoviediv");
    for(i = 0; i<newmoviedivs.length; i++){
        newmoviedivs[i].addEventListener("click", clicknewmoviediv);
    }
}

function clicknewmoviediv()
{
    var GetMovieId = jQuery(this).attr("id");
    var IdInMovieArray = Number(GetMovieId.slice(5));
    var MovieIDClicked = MovieArray[IdInMovieArray][0];
    var MovieClickedCinema = GetMovieId+"_";
    var MovieClickedShowTime = GetMovieId+"__";

    document.getElementById("movieinfo").innerHTML="";

    document.getElementById("movieinfo").innerHTML+='<div class="newmoviediv" id='+ GetMovieId +'> ' +
        '<div class="posterdiv"><img src='+MovieArray[IdInMovieArray][1] +'></div> ' +
        '<div class="infodiv">'+MovieArray[IdInMovieArray][2]+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+MovieArray[IdInMovieArray][3]+'<br><br>'+MovieArray[IdInMovieArray][4]+'<br><br><br><button class="backtoallmovies" onclick="clickbacktoallmovies()">back</button> </div> ' +
        '</div>' +
        '<div class="newcinemadiv">' +
        '<div class="cinemainfo" id='+MovieClickedCinema+'></div>' +
        '<div class="showtimeinfo" id='+MovieClickedShowTime+'></div>' +
        '</div>';
    document.getElementById("pagenumber").style.display="none";
    var today = new Date();
    var starttime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+(today.getDate()+1)+"T00:00:00+08:00";
    var endtime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+(today.getDate()+2)+"T00:00:00+08:00";

    $.post("http://www.singaporemovies.xyz:8000/getshowtime",
        JSON.stringify({
            "id": MovieIDClicked,
            "from_time": starttime,
            "to_time": endtime
        }),function(data) {
            var Cinemajson = JSON.parse(data);
            var OnShowCinemaList = Cinemajson["cinema"];
            console.log(OnShowCinemaList)
            var OnShowCinema_latlon ="";
            for(i = 0; i < OnShowCinemaList.length; i++) {
                var OnShowCinemait = OnShowCinemaList[i]
                var OnShowCinema_id = OnShowCinemait["cinemaid"]
                var DIVOnShowCinema_id = MovieIDClicked + "Cinema" + OnShowCinema_id + "Cinema" + MovieClickedShowTime +"Cinema"+ MovieArray[IdInMovieArray][5] +"Cinema"+ MovieArray[IdInMovieArray][2];
                var OnShowCinema = $.grep(CinemaArray, function(e){
                    return e.cinema_id == OnShowCinema_id;
                })
                var OnShowCinema_name = OnShowCinema[0]["cinema_name"];
                var OnShowCinema_lat = OnShowCinema[0]["cinema_lat"];
                var OnShowCinema_lon = OnShowCinema[0]["cinema_lon"];

                document.getElementById(MovieClickedCinema).innerHTML += '<div class="DIVOnShowCinema_id" id=' + DIVOnShowCinema_id + '>' + OnShowCinema_name + '</div>';
                if(i < OnShowCinemaList.length-1){
                    OnShowCinema_latlon += '{"type":"Feature","id":'+ Number(OnShowCinema_id)+',"geometry": {"type":"Point","coordinates":[' + OnShowCinema_lon + ',' + OnShowCinema_lat + ']},"properties": {"id":"' + OnShowCinema_id + '", "name":"' + OnShowCinema_name + '"}},';
                }else {
                    OnShowCinema_latlon += '{"type":"Feature","id":'+ Number(OnShowCinema_id)+',"geometry": {"type":"Point","coordinates":[' + OnShowCinema_lon + ',' + OnShowCinema_lat + ']},"properties": {"id":"' + OnShowCinema_id + '", "name":"' + OnShowCinema_name + '"}}';
            }
            }
            var OnShowCinema_string='{"type": "geojson","data":{"type": "FeatureCollection","features":['+OnShowCinema_latlon+']}}'
            var OnShowCinema_latlonJSON = JSON.parse(OnShowCinema_string);
            console.log(OnShowCinema_latlonJSON)
            map.addSource("OnShowCinema", OnShowCinema_latlonJSON)
            map.loadImage('./img/normal.png', function(error, image) {
                if (error) throw error;
                map.addImage('normal', image);
                map.addLayer({
                    "id": "normalP",
                    "type": "symbol",
                    "source": "OnShowCinema",
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
                    "id": "highLightP",
                    "type": "symbol",
                    "source": "OnShowCinema",
                    "layout": {
                        "icon-allow-overlap":true,
                        "icon-image": "highlight",
                        "icon-size": 0.1
                    },
                    "paint":{
                        "icon-opacity": ["case",
                            ["boolean", ["feature-state", "hover"], false],
                            1,
                            0.0001
                        ],
                    }});
            });

            var DIVOnShowCinema_ids = document.getElementsByClassName("DIVOnShowCinema_id");
            for(i = 0; i<DIVOnShowCinema_ids.length; i++){
                DIVOnShowCinema_ids[i].addEventListener("click", clickDIVOnShowCinema_id);
            }

            var mouseenters = document.getElementsByClassName("DIVOnShowCinema_id");
            for(i=0; i<mouseenters.length; i++){
                console.log(mouseenters)
                mouseenters[i].addEventListener("mouseenter",function(e) {
                    var commentid = e.target.id;
                    var comment= Number(commentid.split("Cinema")[1]);
                    console.log(commentid)
                    map.setFeatureState({source: "OnShowCinema",id: comment}, {hover: true});
                })
            }

            var mouseleaves = document.getElementsByClassName("DIVOnShowCinema_id");
            for(i=0; i<mouseleaves.length; i++){
                mouseleaves[i].addEventListener("mouseleave",function (e) {
                    var commentid = e.target.id;
                    var comment= Number(commentid.split("Cinema")[1]);
                    map.setFeatureState({source: "OnShowCinema",id: comment}, {hover: false});
                })
            }

        });
}

function clickDIVOnShowCinema_id()
{
    var GetMovieCinemaId = jQuery(this).attr("id");
    var MovieCinemaId = GetMovieCinemaId.split("Cinema");
    var ShowTimeCinemaId = MovieCinemaId[1];
    var ShowTimeMovieId = MovieCinemaId[0];
    var ShowTimeDivId = MovieCinemaId[2];
    var today_ = new Date();
    var starttime_ = today_.getFullYear()+"-"+(today_.getMonth()+1)+"-"+(today_.getDate()+1)+"T00:00:00+08:00";
    var endtime_ = today_.getFullYear()+"-"+(today_.getMonth()+1)+"-"+(today_.getDate()+2)+"T00:00:00+08:00";

    var showtimeinfos = document.getElementsByClassName("showtimeinfo");
    for(i = 0; i<showtimeinfos.length; i++){
        showtimeinfos[i].innerHTML="";
    }
    $.post("http://www.singaporemovies.xyz:8000/getshowtimebycinema",
        JSON.stringify({
            "id": ShowTimeMovieId,
            "cinemaid": ShowTimeCinemaId,
            "from_time": starttime_,
            "to_time":endtime_
        }),function(data){
        console.log(JSON.parse(data));
            var ShowTimejson = JSON.parse(data);
            var ShowTimeList = ShowTimejson["cinema"][0]["time"];
            for(i = 0; i < ShowTimeList.length; i++) {
                var ShowTimeit = ShowTimeList[i]
                var ShowTime = ShowTimeit.split("T")
                var ShowTime2 = ShowTime[1].split("+")
                var ShowTimeOnScreen = ShowTime2[0]
                var ShowTimeCinemaObj = $.grep(CinemaArray, function(e){
                    return e.cinema_id == ShowTimeCinemaId;
                })
                var ShowTimeCinema_name = ShowTimeCinemaObj[0]["cinema_name"];
                sessionStorage.setItem("cinema",JSON.stringify(ShowTimeCinema_name));
                var DIVOnShowTime_id = ShowTimeit + "Cinema" + GetMovieCinemaId;
                document.getElementById(ShowTimeDivId).innerHTML+= "<div class='DIVOnShowTime_id' id="+DIVOnShowTime_id+">"+ShowTimeOnScreen+"</div>";
            }
            map.removeImage("normal");
            map.removeImage("highlight");
            map.removeLayer("normalP");
            map.removeLayer("highLightP");
            map.removeSource("OnShowCinema");

            var ShowTimeCinema_location = $.grep(CinemaArray, function(e){
                return e.cinema_id == ShowTimeCinemaId;
            })
            var ShowTimeCinema_lat = ShowTimeCinema_location[0]["cinema_lat"];
            var ShowTimeCinema_lon = ShowTimeCinema_location[0]["cinema_lon"];
            var ShowTimeCinema_latlon = '{"type":"Feature","geometry":{"type":"Point","coordinates":['+ShowTimeCinema_lon+','+ShowTimeCinema_lat+']},"properties":{"id":"'+ShowTimeCinemaId+'","name":"'+ShowTimeCinema_name+'"}}';
            var ShowTimeCinema_Geo= '{"type": "geojson","data":{"type": "FeatureCollection","features":['+ShowTimeCinema_latlon+']}}'
            var ShowTimeCinema_GeoJSON = JSON.parse(ShowTimeCinema_Geo);
            map.addSource("OnShowCinema", ShowTimeCinema_GeoJSON)
            console.log(ShowTimeCinema_GeoJSON)
            map.loadImage('./img/normal.png', function(error, image) {
                if (error) throw error;
                map.addImage('normal', image);
                map.addLayer({
                    "id": "normalP",
                    "type": "symbol",
                    "source": "OnShowCinema",
                    "layout": {
                        "icon-allow-overlap":true,
                        "icon-image": "normal",
                        "icon-size": 0.1
                    },
                    "paint":{
                        "icon-opacity":["case",
                            ["boolean", ["feature-state", "hover"], false],
                            1,
                            0.001]
                    }});
            });
            map.loadImage('./img/highlight.png', function(error, image) {
                if (error) throw error;
                map.addImage('highlight', image);
                map.addLayer({
                    "id": "highLightP",
                    "type": "symbol",
                    "source": "OnShowCinema",
                    "layout": {
                        "icon-allow-overlap":true,
                        "icon-image": "highlight",
                        "icon-size": 0.1
                    },
                    "paint":{
                        "icon-opacity": 1,
                    }});
            });

            var DIVOnShowTime_ids = document.getElementsByClassName("DIVOnShowTime_id");
            for(i=0; i<DIVOnShowTime_ids.length; i++){
                DIVOnShowTime_ids[i].addEventListener("click", clickDIVOnShowTime_id);
            }
})
};

function clickDIVOnShowTime_id()
{
    if(SignInBool) {
        var GetShowTimeId = jQuery(this).attr("id");
        sessionStorage.setItem("info", JSON.stringify(GetShowTimeId));
        window.location.href = "page2.html";
    }
    else{
        alert("Please sign in or sign up first!");
    }
};

function clickbacktoallmovies(){
    document.getElementById("movieinfo").innerHTML = "";
    if (PageIndex < MoviesPages) {
        for (i = 1; i < 10; i++) {
            var k_ = 10 * (PageIndex - 1) + i - 1;
            var movieid = "movie" + k_;
            var cinemaid = movieid + "_";
            var timeid = movieid + "__";
            document.getElementById("movieinfo").innerHTML += '<div class="newmoviediv" id=' + movieid + '>' +
                '<div class="posterdiv"><img src=' + MovieArray[k_][1] + '></div>' +
                '<div class="infodiv">' + MovieArray[k_][2] + '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + MovieArray[k_][3] + '<br><br>' + MovieArray[k_][4] + '</div>' +
                '</div>';
        }
    } else {
        var FinalPageIndex = MovieNum % 10;
        for (i = 1; i < FinalPageIndex; i++) {
            var k_ = 10 * (PageIndex - 1) + i;
            var movieid = "movie" + k_;
            var cinemaid = movieid + "_";
            var timeid = movieid + "__";
            document.getElementById("movieinfo").innerHTML += '<div class="newmoviediv" id=' + movieid + '>' +
                '<div class="posterdiv"><img src=' + MovieArray[k_][1] + '></div>' +
                '<div class="infodiv">' + MovieArray[k_][2] + '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + MovieArray[k_][3] + '<br><br>' + MovieArray[k_][4] + '</div>' +
                '</div>';
        }
    }
    document.getElementById("pagenumber").style.display = "";
    map.removeImage("normal");
    map.removeImage("highlight");
    map.removeLayer("normalP");
    map.removeLayer("highLightP");
    map.removeSource("OnShowCinema");

var newmoviedivs = document.getElementsByClassName("newmoviediv");
    for(i = 0; i<newmoviedivs.length; i++){
        newmoviedivs[i].addEventListener("click", clicknewmoviediv);
    }
};

var newmoviedivs = document.getElementsByClassName("newmoviediv");
for(i = 0; i<newmoviedivs.length; i++){
    newmoviedivs[i].addEventListener("click", clicknewmoviediv);
}

var DIVOnShowCinema_ids = document.getElementsByClassName("DIVOnShowCinema_id");
for(i = 0; i<DIVOnShowCinema_ids.length; i++){
    DIVOnShowCinema_ids[i].addEventListener("click", clickDIVOnShowCinema_id);
}

var DIVOnShowTime_ids = document.getElementsByClassName("DIVOnShowTime_id");
for(i=0; i<DIVOnShowTime_ids.length; i++){
    DIVOnShowTime_ids[i].addEventListener("click", clickDIVOnShowTime_id);
}

function btnsignin() {
    window.location.href = "page6.html";
}

function btnsignup() {
    window.location.href = "page5.html";
    }

function btnmyprofile() {
    window.location.href = "page4.html";
}

function btnsignout() {
    SignInBool = false;
    document.getElementById("signin")
        .style.display= "";
    document.getElementById("signup")
        .style.display= "";
    document.getElementById("myprofile")
        .style.display= "none";
    document.getElementById("signout")
        .style.display= "none";
    sessionStorage.removeItem("user")
}