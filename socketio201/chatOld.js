const express = require('express');
const app = express();
const socketio = require('socket.io');


app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer); // hand express over to socket io

//you can use io.on('connect',...) instead of 'connection 
//io.on = io.of('/').on is same thing 
io.on('connection', (socket) => {
    socket.emit('messageFromServer', { data: 'Message from server'})

    socket.on('dataToServer', (dataFromClient) => {
        console.log(dataFromClient)
    });

    socket.on('newMessageToServer', (msg) => {
        console.log(msg);
        io.emit('messageToClients', {text: msg.text});
    });

    /*
    the server can still communicate across namespace but on the 
    clientInformation, the socket needs to be in THAT namespace in
    order to get the events
    */
   setTimeout(() => {
    io.of('/admin').emit('welcome', "Welcome to the admin channel, from the main channel!");
   }, 2000);
   
});

io.of('/admin').on('connection', (socket) => {
    console.log("someone connected to the admin namespace");
    io.of('/admin').emit('welcome', "Welcome to the admin channel!")
});