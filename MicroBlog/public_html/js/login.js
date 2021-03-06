
function login() {

    if (window.XMLHttpRequest)
    {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function ()
    {
        if (this.readyState === 4)
        {

            visualJson(this.responseText);

        }

    };

    var username = document.formLogin.loginUsername.value;
    var password = document.formLogin.loginPassword.value;

    let re = /[\s]/;
    var resUsername = re.test(username);
    var resPassword = re.test(password);

    if (username === "")
    {
        document.getElementById("status").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"
                + "Username field  must not be null"
                + "</div>";
    } else if (password === "")
    {
        document.getElementById("status").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"
                + "Password field  must not be null"
                + "</div>";
    } else if (resUsername)
    {
        document.getElementById("status").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"
                + "Username field  must not contain space characters"
                + "</div>";
    } else if (resPassword)
    {
        document.getElementById("status").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"
                + "Password field  must not contain space characters"
                + "</div>";
    } else
    {
        var address = "http://localhost:8080/users?username=" + username + "&password=" + password;
        xmlhttp.open("GET", address, true);
        xmlhttp.send();
    }
}

function visualJson(json) {

    var parsedJson = JSON.parse(json);
    var codice = 'Codice di risposta http: ' + parsedJson.server + '<br>';
    var output = 'esito: ' + parsedJson.response;
    document.getElementById("risultato").innerHTML = codice + output;
    switch (parsedJson.server) {
        case 200:

            document.getElementById("status").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">"
                    + "User found"
                    + "</div>";

            if (document.formLogin.loginUsername.value === "admin")
                setCookie("enablePost", "true", 1);
            else
                setCookie("enablePost", "false", 1);

            setCookie("userId", parsedJson.response.id, 1);
            location.assign("blog.html");

            break;
        default:
            document.getElementById("status").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"
                    + "Error, try again..."
                    + "</div>";
    }
}

function checkPermissions()
{
    var userId = getCookie("userId");
    if (userId === "" || userId === "0")
    {
        document.getElementById("logoutSpan").innerHTML = "Back";
        document.getElementById("divFormPost").innerHTML = "";
        document.getElementById("risultato").innerHTML = "";
        document.getElementById("risultato-raw").innerHTML = "";
        showPostsListNotLogged('http://localhost:8080/posts/');
    } else //se l'utente è registrato
    {
        checkPostPermission();
        showPostsList('http://localhost:8080/posts/');
    }
}

function checkPostPermission()
{
    var permission = getCookie("enablePost");
    var userId = getCookie("userId");
    getUserById('http://localhost:8080/users/' + userId);

    if (permission === "true")
    {
        document.getElementById("divFormPost").innerHTML = '<form name="formPost" class="col-md-3">'
                + '<div class="form-group">'
                + '<label for="title">Title</label>'
                + '<input type="text" class="form-control" name="title" id="title" placeholder="">'
                + '</div>'
                + '<div class="form-group ">'
                + '<label for="postText">What do you want to write?</label>'
                + '<textarea class="form-control" name="postText" id="postText" rows="3"></textarea>'
                + '<input type="button" value="Post" onclick="createPost(\'http://localhost:8080/posts/\',this.form)">'
                + '</div>'
                + '</form>';
    }

}

function showPostsListNotLogged(address) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            visualPostsJsonNotLogged(this.responseText);

        }
    };
    xmlhttp.open("GET", address, true);
    xmlhttp.send();
}

function visualPostsJsonNotLogged(json) {
    var parsedJson = JSON.parse(json);

    var posts = "";
    for (i = parsedJson.response.length - 1; i >= 0; i--) {

        //valori del post presi dal json
        var id = parsedJson.response[i].id;
        var title = parsedJson.response[i].titolo;
        var author = parsedJson.response[i].autore.username;
        var date = parsedJson.response[i].dataOra;
        var text = parsedJson.response[i].testo;

        //clonazione del post template
        var postTemplateNodes = document.getElementById("templates").childNodes;
        var clonedPost = postTemplateNodes[1].cloneNode(true);

        //assegnazione dell'id del post al div
        var att = document.createAttribute("id");       // Create a "id" attribute
        att.value = id;                           // Set the value of the id attribute
        clonedPost.setAttributeNode(att);

        //assegnazione dell'id del post al div
        var buttonOnclick = document.createAttribute("onclick");       // Create a "id" attribute
        buttonOnclick.value = "getPostByIdNotLogged(" + id + ")";                           // Set the value of the id attribute
        clonedPost.getElementsByClassName("btn btn-primary")[0].setAttributeNode(buttonOnclick);

        //compilazione del post
        clonedPost.getElementsByClassName("card-header")[0].innerHTML = author;
        clonedPost.getElementsByClassName("card-title")[0].innerHTML = title;
        clonedPost.getElementsByClassName("card-text")[0].innerHTML = text;
        clonedPost.getElementsByClassName("card-footer")[0].innerHTML = date;

        //caricamento del post nella pagina html
        document.getElementById("posts").appendChild(clonedPost);
    }
}
function getPostByIdNotLogged(postId) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            switch (this.status) {
                case 200:
                    showPostWithCommentsNotLogged(this.responseText);
                    break;
            }
        }
    };
    xmlhttp.open("GET", "http://localhost:8080/posts/" + postId, true);
    xmlhttp.send();
}

function showPostWithCommentsNotLogged(post) {

    var parsedPostJson = JSON.parse(post);

    var id = parsedPostJson.response.id;
    var title = parsedPostJson.response.titolo;
    var author = parsedPostJson.response.autore;
    var date = parsedPostJson.response.dataOra;
    var text = parsedPostJson.response.testo;

    var post = JSON.stringify({"id": id, "titolo": title, "autore": author, "dataOra": date, "testo": text});

    getCommentsByPostNotLogged(post, id);

}

function getUserById(address) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            setUserJson(this.responseText);

        }

    };
    xmlhttp.open("GET", address, true);
    xmlhttp.send();
}

function setUserJson(json) {
    var parsedJson = JSON.parse(json);
    document.getElementById("userwelcome").innerHTML = parsedJson.response.username;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showPostsList(address) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            visualPostsJson(this.responseText);

        }
    };
    xmlhttp.open("GET", address, true);
    xmlhttp.send();
}

function visualPostsJson(json) {
    var parsedJson = JSON.parse(json);
    var output = '<div> Codice di risposta http: ' + parsedJson.server;
    var table = '<table class="table row justify-content-md-center"><tr><th>Id</th><th>Title</th><th>Author</th><th>Date & hour</th><th>Text</th></tr>';
    for (i = 0; i < parsedJson.response.length; i++) {
        table += "<tr><td>" +
                parsedJson.response[i].id + "</td><td>" +
                parsedJson.response[i].titolo + "</td><td>" +
                parsedJson.response[i].autore.username + "</td><td>" +
                parsedJson.response[i].dataOra + "</td><td>" +
                parsedJson.response[i].testo + "</td></tr>";
    }
    table += "</table>";
    document.getElementById("risultato").innerHTML = output + table;
}