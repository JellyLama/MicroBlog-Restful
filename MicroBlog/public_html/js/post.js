function createPost(address) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            switch (this.status) {
                case 201:
                    var parsedJson = JSON.parse(this.responseText);
                    //var selfUrl = this.getResponseHeader("location");
                    var codice = 'Codice di risposta http: ' + parsedJson.server + '<br>';
                    var output = 'esito: ' + "post creato" + '<br>';
                    //var location = 'location: ' + selfUrl;
                    document.getElementById("risultato").innerHTML = codice + output;
                    getPost(parsedJson.response);
                    break;
                case 404:
                    document.getElementById("risultato").innerHTML = "Errore 404 ";
                    break;
                default:
                    document.getElementById("risultato").innerHTML = "Non creato.";
            }

        }

    };
    var title = document.formPost.title.value;
    var postText = document.formPost.postText.value;
    var autore = {"id": Number(getCookie("userId"))};
    var date = new Date();
    xmlhttp.open("POST", address, true);
    var post = JSON.stringify({"titolo": title, "autore": autore, "dataOra": date, "testo": postText});
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(post);
}

function getPost(address) {

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            showPost(this.responseText);

        }
    };
    xmlhttp.open("GET", address, true);
    xmlhttp.send();
}

function showPost(json) {
    var parsedJson = JSON.parse(json);
    var httpCode = parsedJson.server;

    var oldPosts = document.getElementById('posts');
    
    //valori del post presi dal json
    var id = parsedJson.response.id;
    var title = parsedJson.response.titolo;
    var author = parsedJson.response.autore.username;
    var date = parsedJson.response.dataOra;
    var text = parsedJson.response.testo;
    
    //clonazione del post template
    var postTemplateNodes = document.getElementById("templates").childNodes;
    var clonedPost = postTemplateNodes[1].cloneNode(true);
    
    //assegnazione dell'id del post al div
    var att = document.createAttribute("id");       // Create a "class" attribute
    att.value = id;                           // Set the value of the class attribute
    clonedPost.setAttributeNode(att);   
    
    //compilazione del post
    clonedPost.getElementsByClassName("card-header")[0].innerHTML = author;
    clonedPost.getElementsByClassName("card-title")[0].innerHTML = title;
    clonedPost.getElementsByClassName("card-text")[0].innerHTML = text;
    clonedPost.getElementsByClassName("card-footer")[0].innerHTML = date;
    
    //caricamento del post nella pagina html
    oldPosts.insertBefore(clonedPost, oldPosts.firstChild);
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
    var httpCode = parsedJson.server;

    var posts = "";
    for (i = parsedJson.response.length-1; i >= 0; i--) {
        
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
        var att = document.createAttribute("id");       // Create a "class" attribute
        att.value = id;                           // Set the value of the class attribute
        clonedPost.setAttributeNode(att); 
        
        //compilazione del post
        clonedPost.getElementsByClassName("card-header")[0].innerHTML = author;
        clonedPost.getElementsByClassName("card-title")[0].innerHTML = title;
        clonedPost.getElementsByClassName("card-text")[0].innerHTML = text;
        clonedPost.getElementsByClassName("card-footer")[0].innerHTML = date;
        
        //caricamento del post nella pagina html
        document.getElementById("posts").appendChild(clonedPost);
    }
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