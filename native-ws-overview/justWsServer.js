const http = require('http');
// 3rd party module, ws!
const websocket = require('ws');

const server = http.createServer((req,res) =>{
    res.end("I am connected!");
});

//es6 syntax for server: server is just server
const wss = new websocket.Server({ server })
wss.on('headers', (msg) => {
    console.log(msg);
});

wss.on('connection', (ws, req) => {
    ws.send('Welcome to the websocket server!!');
    ws.on('message', (msg)=>{
        console.log(msg);
    })
});


server.listen(8000);
