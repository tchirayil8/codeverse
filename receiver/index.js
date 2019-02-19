window.onload = function () {
    var connection = new WebSocket('ws://127.0.0.1:8000');

    connection.onopen = function () {
        console.log("open")
        this.send("receiver");
    };

    connection.onerror = function (error) {
        console.log("error on server");
    };

    connection.onmessage = function (message) {
        console.log("message received from server: ", message.data);
        blobToImage(message.data);
    };
}

function blobToImage(blob){
    console.log(blob);
    url = URL.createObjectURL(blob);
    document.getElementById("myImg").src = url;
}