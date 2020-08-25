
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const os = require('os');
var networkInterfaces = os.networkInterfaces();
var connectedUsers = 0;

function zeroUsers() {
  if (connectedUsers < 0) {
    connectedUsers = 0;
  }
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
})

io.on('connection', (socket) => {
    socket.on('new user', (username) => {
        console.log('A user connected at ' + socket.handshake.address);
        connectedUsers += 1;
        console.log(connectedUsers);
        socket.username = username;
        console.log(socket.username)
        io.emit('new user', username + " has joined the chat!");
        io.emit('user count', connectedUsers);
    })
    socket.on('disconnect', () => {
        console.log('User Disconnected');
        connectedUsers -= 1;
        zeroUsers();
        io.emit('user left', `${socket.username} left the chat!`);
        io.emit('user count', connectedUsers);
    })
    socket.on('chat message', (msg, username) => {
        io.emit('chat message', msg, username);
    });

})

http.listen(3000, () => {
    console.log('listening on port 3000');
    console.log(networkInterfaces);
})