const username = prompt('Choose Username: ').toString().replaceAll("<", "").replaceAll(">", "");


function enlargeThumbnail() {
    var bg = document.createElement('div');
    bg.classList.add('thumbnail-bg');
    bg.setAttribute("onclick","closeEnlarge()");
    document.body.appendChild(bg);
    bg.appendChild();
    console.log("Added BG")
}

function closeEnlarge() {
    var overlay = document.querySelector('.thumbnail-bg')
    document.body.removeChild(overlay);
}

// ------------- Everything below this is socket.io related ----------------
var socket = io();

    // emit when client joins to other sockets
    socket.emit('new user', username)

    // new user
    socket.on('new user', (msg) => {
        $('#messages').append($('<li class="text-message">').html("<span class='username'> Server </span><span class='message'>" + msg + "</span>"));
    })

    // handle form message submit -- cleanup AND add file support
    const messageForm = document.getElementById('messageForm')
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevents page reload
        // grab file
        var file = document.getElementById('file-upload').files
        // grab message
        var message = e.target.elements.m.value;
        console.log(file)
        // submit message
        if (file.length ==  0) {
            console.log('No image')
            socket.emit('chat message', message, username); // submit message, username, and file -- maybe omit username in future?
            console.log('Message Sent to Server')
        } else {
            console.log('image')
            let reader = new FileReader();
            reader.onload = () => {
                file = reader.result;
                console.log(file.length)
                socket.emit('chat message', message, username, file);
            }
            reader.readAsDataURL(file[0]);
            
        }
         
        e.target.elements.m.value = '';
    });

    // recieve mesaage
    socket.on('chat message', function (msg, username, file = null) {
        if (file == null) {
        $('#messages').append($('<li class="text-message">').html(`<span class='username'>${username}</span><span class='message'>${msg}</span>`));
        } else {
        $('#messages').append($('<li class="text-message">').html(`<span class='username'>${username}</span><span class='message'>${msg}</span><img class='thumbnail' onclick='enlargeThumbnail(this)' src='${file}' />`));
        }

        var messages = document.getElementById("messages");
        messages.scrollTop = messages.scrollHeight;
    });

    // user left
    socket.on('user left', (msg) => {
        $('#messages').append($('<li class="text-message">').html("<span class='username'> Server </span><span class='message'>" + msg + "</span>"));
    });

    // used to update user count
    socket.on('user count', (userCount) => {
        $('#user-count').text('Users Online: ' + userCount);
    });