const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
//console.log(namespaces);
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer); // hand express over to socket io

//io.on = io.of('/').on is same thing 
io.on('connection', (socket) => {
    //build an array to send back w/ img and endpoint for each NS
    console.log(socket.handshake);
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    }); 
    //console.log(nsData);
    
    //send nsData back to client. Need to use socket, NOT io, b/c we want it to 
    //go to just this client
    socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) =>{
    //console.log(namespace);
    //const thisNs = io.of(namespace.endpoint);
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username;
        //console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        //a socket has connected to one of our chatgroup namespaces.
        //send that ns group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback)=>{
            //deal with history.. once we have it 
            
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            nsSocket.join(roomToJoin);
            
            /*io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) =>{
                //console.log(clients.length);
                numberOfUsersCallback(clients.length);
            });*/
            const nsRoom = namespace.rooms.find((room) =>{
                return room.roomTitle === roomToJoin;
            });
            console.log(nsSocket.rooms);
            //console.log(nsRoom);
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        })
        nsSocket.on('newMessageToServer', (msg) =>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: "https://via.placeholder.com/30"
            }
            //console.log(fullMsg);
            //send this message to all sockets in the room that THIS socket is in
            // how can we find out what rooms THIS socket is in?
            //console.log(nsSocket.rooms);
            // the user will be in the 2nd room in the object list
            //this is b/c socket ALWAYS joins its own room on connection
            //get keys
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            //console.log(roomTitle);
            //we need to find the Room object for this room 
            const nsRoom = namespace.rooms.find((room) =>{
                return room.roomTitle === roomTitle;
            });
            //console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    });
});

function updateUsersInRoom(namespace, roomToJoin) {
    //send back the number of users in this room to ALL sockets connected to this room
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) =>{
        //console.log(`There are ${clients.length} in this room`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}