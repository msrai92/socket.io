const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer); // hand express over to socket io

//you can use io.on('connect',...) instead of 'connection 
io.on('connection', (socket) => {
    socket.emit('messageFromServer', { data: 'Message from server'})

    socket.on('dataToServer', (dataFromClient) => {
        console.log(dataFromClient)
    });

    socket.on('newMessageToServer', (msg) => {
        io.emit('messageToClients', {text: msg.text});
    });
});