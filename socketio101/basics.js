// we need http since we are not using express rn
const http = require('http');
// need socket io its third part
const socketio = require('socket.io');

//we make an http server with node!
const server = http.createServer((req,res) =>{
    res.end("I am connected with socketio!");
});

// socketio is piggy backing off our http server to listen
const io = socketio(server);

io.on('connection', (socket, req) => {
    // ws.send becomes socket.emit
    socket.emit('welcome', 'Welcome to the websocket server!!');
    //unlike in ws we can name it anything not just message
    socket.on('message', (msg)=>{
        console.log(msg);
    })
});

server.listen(8000);