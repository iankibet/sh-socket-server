const express = require('express')
const Redis = require("ioredis");
const http = require('http')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
exports.runServer = function runServer (config) {
    const io = require('socket.io') (server, {
        origin:config.redisHost,
        methods: ["GET", "POST"],
    })
    const redisConf = {
        host: config.redisHost,
        port: config.redisPort
    }
    const sub = new Redis(redisConf)
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
        socket.on('leaveChannel', (chan) => {
            console.log('left channel:' + chan)
            socket.leave(chan)
        })
        console.log('user connected')
    })
    server.listen(config.httpPort, () => {
        console.log('server started in port ' + config.httpPort)
    })
}
