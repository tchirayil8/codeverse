window.onload = function () {
    var connection = new WebSocket('ws://localhost:8000');
    let queue = [];

    connection.onopen = function () {
        console.log("open")
        this.send("receiver");
    };

    connection.onerror = function (error) {
        console.log("error on server");
    };

    connection.onmessage = function (message) {
        console.log("message received from server: ", message.data);
        blobToImage(message.data, queue);
    };

    setInterval(function (){
        console.log(queue)
        if (queue.length != 0) {
            document.getElementById("myImg").src = queue.shift();
        }
    }, 10);
}

function blobToImage(blob, queue){
    console.log(blob);
    url = URL.createObjectURL(blob);
    queue.push(url);
}