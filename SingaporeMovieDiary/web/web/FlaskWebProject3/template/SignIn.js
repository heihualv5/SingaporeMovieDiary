function btnreturn6() {
    window.location.href = "page1.html";
    $("#loadinghide").show();
    $("#gif").show();
    sessionStorage.removeItem("")
}

function btnconfirm6(){
    var a=JSON.stringify({
        "User_ID": $("#text").val(),
        "Password": $("#password").val()
    })
    console.log(a)
        console.log($("#text").val())
        $.post("http://www.singaporemovies.xyz:8000/signin",
            a,
            function(data) {
                console.log(data)
                var userjson = JSON.parse(data);
                if (userjson == "error" || userjson == "fail") {
                    alert("ID or password is incorrect!");
                } else {
                    sessionStorage.setItem("user",JSON.stringify({
                        "UserId": userjson["_user__User_ID"],
                        "Name": userjson["_user__Name"],
                        "Password": $("#password").val()
                    })
                    );
                }
                window.location.href = "page1.html";
            }
        )
    }

function btncancel6() {
    $("#text").val("");
    $("#password").val("")
}