const express = require('express')
const Redis = require("ioredis");
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const redisConf = { host: "localhost", port: 6379 }
const sub = new Redis(redisConf);
const pub = new Redis(redisConf);

sub.psubscribe('*', (err, count) => {
    console.log(err, count)
})

sub.on('pmessage', (pattern, channel, message) => {
    try{
        const eventData = JSON.parse(message)
        const event = eventData.event.replace('App\\Events\\','')
        io.to(channel).emit(event,eventData.data)
        console.log("New event")
        console.log('Room: ' + channel)
        console.log('Event: ' + event)
    }catch (e) {
        console.log('Error decoding event', '-Channel: ' +channel, '-Message: ' + message)
        io.emit('hello', message)
    }
})
io.on('connection', socket => {
    const clientId = socket.id
    socket.on('joinChannel', (chan) => {
        console.log('joined channel:' + chan)
        socket.join(chan)
    })
    console.log('user connected')
})


server.listen(6001, () => {
    console.log('server started in port 6001')
})
