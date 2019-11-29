function btnreturn5() {
    window.location.href = "page1.html";
    $("#loadinghide").show();
    $("#gif").show();
}

function btnconfirm5() {
    $.post("http://www.singaporemovies.xyz:8000/signup",
        JSON.stringify({
                "Name":$("#text").val(),
                "Password":$("#password").val()
            }),
        function(data){
            var json = JSON.parse(data);
            if(json == "error"){
                alert("Account already exist!");
            }
            else{
                alert("Welcome! Your account is created. Your ID is " + json["_user__User_ID"] +" . Please return to the homepage and sign in.");
                window.location.href = "page6.html";
            }

        }
    )
    }

function btncancel5() {
    $("#text").val("");
    $("#password").val("")
    }