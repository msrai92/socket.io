const express = require('express');
const app = express();
const socketio = require('socket.io');


app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer); // hand express over to socket io

//you can use io.on('connect',...) instead of 'connection 
//io.on = io.of('/').on is same thing 
io.on('connection', (socket) => {
    socket.emit('messageFromServer', { data: 'Welcome to the socketio server'})

    socket.on('dataToServer', (dataFromClient) => {
        console.log(dataFromClient)
    });

    socket.join('level1');
    io.of('/').to('level1').emit('joined', `${socket.id} I have joined the level 1 room!`);

});

io.of('/admin').on('connection', (socket) => {
    console.log("someone connected to the admin namespace");
    io.of('/admin').emit('welcome', "Welcome to the admin channel!")
});