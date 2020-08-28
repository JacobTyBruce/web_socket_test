const fs = require('fs');
// ssl
const hostname = 'randomchat.tech';

const options = {
    cert: fs.readFileSync("./ssl/www_randomchat_tech.crt"),
    ca: fs.readFileSync("./ssl/www_randomchat_tech.ca-bundle"),
    key: fs.readFileSync("./ssl/example_com.key")
}

const app = require('express')();
const https = require('https').createServer(options, app)
const io = require('socket.io')(https);
const os = require('os');

// network
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
        realTimeUsers.inc();
        console.log(connectedUsers);
        socket.username = username;
        console.log(socket.username)
        io.emit('new user', username + " has joined the chat!");
        io.emit('user count', connectedUsers);
    })
    socket.on('disconnect', () => {
        console.log('User Disconnected');
        connectedUsers -= 1;
        realTimeUsers.dec();npm
        zeroUsers();
        io.emit('user left', `${socket.username} left the chat!`);
        io.emit('user count', connectedUsers);
    })
    socket.on('chat message', (msg, username, file) => {
        io.emit('chat message', msg, username, file);
    });

})

https.listen(3000, () => {
    console.log('listening on port 3000');
    console.log(networkInterfaces);
})