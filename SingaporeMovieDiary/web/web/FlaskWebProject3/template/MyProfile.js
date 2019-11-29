var User = JSON.parse(sessionStorage.getItem("user"));
var UserName = User["Name"];
var UserId = User["UserId"];
var UserPassword = User["Password"];
var UserCommentList;
$.ajaxSettings.async = false;
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpemhvbmd6IiwiYSI6ImNrMXoza3oyejB0eW4zZGwyYWVydWcxMWQifQ.dPJrQVdfgHaDpb1A2b50mw';
map = new mapboxgl.Map({
    container: 'map4',
    minZoom: '11',
    maxZoom: '15',
    center: [103.819839,1.352083],
    style: 'mapbox://styles/huizhongz/ck1z3ngn50u4f1cnankzh4ni1',
});

document.getElementById("mycomments").innerHTML ="<div style='height:10%; font-size:25px; '> &nbsp;&nbsp;&nbsp;"+UserName +"<div id='historicalcomments'></div></div>"

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
    console.log(comment_latlonJSON)
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

var showcomments=function(moviecomments,type) {
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
            document.getElementById("mycomments").innerHTML+='<div class='+'moviecomment'+' id='+commentsid+'><div id="Username">User name: '+commentsusername+'&nbsp;&nbsp;&nbsp;Rate: '+commentsrate+'</div><br><div id="context">'+commentscontext+'</div><div id="Movietime"><br>Movie time: '+cTimeOnScreen +", "+cTime1+'</div></div><div id="space"><br><br></div>'
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
            var commentsid=moviecomments[i]["_comment__Comment_ID"];
            var commentsmoviename = returnstring(moviecomments[i]["_comment__Movie_Name"]);
            var commentstime = moviecomments[i]["_comment__Time"];
            var cTime = commentstime.split("T");
            var cTime1 = cTime[0];
            var cTime2 = cTime[1].split("+");
            var cTimeOnScreen = cTime2[0];
            var commentsrate = moviecomments[i]["_comment__Rate"];
            var commentscontext = returnstring(moviecomments[i]["_comment__Context"]);
            console.log(commentsid)
            document.getElementById("mycomments").innerHTML+='<div class='+'usercomment'+' id='+commentsid+'><div id="Moviename">Movie name: '+commentsmoviename+'&nbsp;&nbsp;&nbsp;Rate: '+commentsrate+'</div><br><div id="context">'+commentscontext+'</div><div id="Movietime"><br>Movie time: '+cTimeOnScreen +", "+cTime1+'</div></div><div id="space"><br><br></div>'
        }
        var userComments=document.getElementsByClassName('usercomment');
        for(i=0;i<userComments.length;i++){
            userComments[i].addEventListener('mouseenter',function(e){
                var commentid=e.target.id
                //console.log(commentid)
                map.setFeatureState({source: "comments",id: commentid},{hover: true});
            })
            userComments[i].addEventListener('mouseleave',function(e){
                var commentid=e.target.id
                //console.log(commentid+"!")
                map.setFeatureState({source: "comments",id: commentid},{hover: false});
            })
        }
    }
}


$.post("http://www.singaporemovies.xyz:8000/signin",
    JSON.stringify({
        "User_ID": UserId,
        "Password": UserPassword
    }),
    function(data) {
        console.log(data)
        var userjson = JSON.parse(data);
        if (userjson == "error" || userjson == "fail") {
            alert("Request timeout. Please try again!");
        } else {
            UserCommentList = userjson["_user__Comments"];
            console.log(UserCommentList);
            if(UserCommentList.length<=0)
            {
                document.getElementById("historicalcomments").innerHTML = "<p>No comments.</p>";
            }
            else{
                var json1=GetCommentGeoJSON(UserCommentList);
                map.on('load', function() {
                    loadmap(json1);})
                console.log(map)
                showcomments(UserCommentList,"user");
                /*Add a map here*/
            }
        }
})

function btnreturn4(){
    window.location.href = "page1.html";
    $("#loadinghide").show();
    $("#gif").show();
}
