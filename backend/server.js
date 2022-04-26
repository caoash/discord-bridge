
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3006

app.use(cors())

app.get('/', (req, res) => {
  res.send("Pong!");
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }    
})

io.on('connection', (socket) => {
    console.log('a user connected');     
    socket.on('recievedMessage', (str) => {
        io.emit('receiveMessage', str);
        console.log(str);
    });
    socket.on('sendMessage', (message) => {
        io.emit('displayDiscord', message);
    });
});