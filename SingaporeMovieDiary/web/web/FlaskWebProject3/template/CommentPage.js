var SelectedCinemaName = JSON.parse(sessionStorage.getItem("cinema"));
var User = sessionStorage.getItem("user");
var SelectedMovieName = sessionStorage.getItem("moviename");
var MovieInfo = sessionStorage.getItem("info");
var MovieInformation = JSON.parse(MovieInfo);
var MovieInfoArray = MovieInformation.split("Cinema");
var SelectedShowTime = MovieInfoArray[0];
var SelectedMovieID = MovieInfoArray[4];
console.log(SelectedMovieName)
var UserCommmentLocation;
$.ajaxSettings.async = false;
var Userjson = JSON.parse(User);
document.getElementById("user3").innerHTML = "User Name: " + Userjson["Name"];
document.getElementById("cinema3").innerHTML = "Cinema Name: " +SelectedCinemaName;
document.getElementById("film3").innerHTML = SelectedMovieName;
var ShowTime = SelectedShowTime.split("T");
var ShowTime2 = ShowTime[1].split("+");
var ShowTimeOnScreen = ShowTime2[0];

document.getElementById("time3").innerHTML ="Start Time: "+ ShowTimeOnScreen;

//get Mapbox Layer//
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpemhvbmd6IiwiYSI6ImNrMXoza3oyejB0eW4zZGwyYWVydWcxMWQifQ.dPJrQVdfgHaDpb1A2b50mw';

var map = new mapboxgl.Map({
    container: 'map3',
    minZoom: '11',
    maxZoom: '15',
    center: [103.819839,1.352083],
    style: 'mapbox://styles/huizhongz/ck1z3ngn50u4f1cnankzh4ni1',
});

//monitor click event//
var clickNum=0;
map.on('click',function(e) {
    clickNum++;
    var LngLat = e.lngLat.toArray();
    if (clickNum>1){
        map.removeImage("normal");
        map.removeLayer("normalP");
        map.removeSource("Points");
    }
    map.addSource("Points",{
        'type': 'geojson',
        'data': {
            'type': "FeatureCollection",
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [LngLat[0], LngLat[1]],
                }
            },
            ]},
    });

    map.loadImage('./img/normal.png', function (error, image) {
        if (error) throw error;
        map.addImage('normal', image);
        map.addLayer({
            "id": "normalP",
            "type": "symbol",
            "source": "Points",
            "layout": {
                "icon-allow-overlap": true,
                "icon-image": "normal",
                "icon-size": 0.1
            },
        });
    });

    UserCommmentLocation = [LngLat[0],LngLat[1]];
});

function btnreturn3(){
    window.location.href = "page2.html";
}

function btnsubmit3() {
    if($("#rate3").val() === ""){
        alert("Please rate the movie before submitting your comment!");
    }else if(!(($("#rate3").val() <= 10) &&($("#rate3").val() >= 0))){
        alert("Please rate the movie on a ten-point scale!");
    }else if(!UserCommmentLocation){
        alert("Please choose your location before submitting your comment!");
    }else{
        var json1 = JSON.stringify({
            "User_ID": Userjson["UserId"],
            "User_Name": Userjson["Name"],
            "Cinema": SelectedCinemaName,
            "IMDB_ID": SelectedMovieID,
            "Rate": $("#rate3").val(),
            "Context": $("#context3").val(),
            "Time": SelectedShowTime,
            "Location": UserCommmentLocation,
            "Movie_Name": SelectedMovieName,
        })
        var json = json1.replace(/\s/g,"%20");
        /*json = json.replace(/\'/g, "&#39;");
        jsonwithoutspace = json.replace(/\n/g, "<br/>");*/

        console.log(UserCommmentLocation)

        $.post("http://www.singaporemovies.xyz:8000/addcomment", json,
            function(data) {
                console.log(data)
                if (data=="succeed")
                {
                    alert('You have successfully post a comment of "' + SelectedMovieName +'"!');
                    window.location.href = "page2.html";
                }
                else if(data=="error")
                {
                    alert("Your comment contains an unrecognizable string. Please re-enter the comment.")
                }
            })
    }}