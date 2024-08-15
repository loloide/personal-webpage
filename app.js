// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require("express");
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

var io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
},
allowEIO3: true
});

function listen() {
  var host = "localhost";
  var port = server.address().port;
  console.log("Example app listening at http://" + host + ":" + port);
}

app.use(express.static("home"));
app.use("/lain", express.static("lain"));
app.use("/talkroom", express.static("talking-room"))


io.sockets.on('connection', (socket)=> {
    console.log("asd", socket.id)
    socket.on('msg',
      function(data) {
        socket.broadcast.emit('msg', data);
      }
    );
    
    // socket.on('disconnect', function() {
    //   console.log("Client has disconnected");
    // });
  }
);