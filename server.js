const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const os = require('os');
var networkInterfaces = os.networkInterfaces();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
})

io.on('connection', (socket) => {
    socket.on('new user', (username) => {
        console.log('A user connected at ' + socket.handshake.address);
        io.emit('new user', username + " has joined the chat!");
    })
    socket.on('disconnect', (username) => {
        console.log('User Disconnected');
        io.emit('disconnected user', username + " has left the chat!");
    })
    socket.on('chat message', (msg, username) => {
        io.emit('chat message', msg, username);
    });

})

http.listen(3000, () => {
    console.log('listening on port 3000');
    console.log(networkInterfaces);
})