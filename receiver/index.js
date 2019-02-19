window.onload = function () {
    var connection = new WebSocket('ws://localhost:8000');
    let queue = [];

    // send receiver message upon connection
    connection.onopen = function () {
        console.log("open")
        this.send("receiver");
    };

    connection.onerror = function (error) {
        console.log("error on server");
    };

    // send message to blobToImage() to be transformed
    connection.onmessage = function (message) {
        console.log("message received from server: ", message.data);
        blobToImage(message.data, queue);
    };

    // continually check the queue for content
    // set the src of the display image to be first
    // url in queue as soon as it is available
    setInterval(function (){
        if (queue.length != 0) {
            document.getElementById("myImg").src = queue.shift();
        }
    }, 10);
}

// make the blob into a url then add to the queue
function blobToImage(blob, queue){
    url = URL.createObjectURL(blob);
    queue.push(url);
}