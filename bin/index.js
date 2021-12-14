#!/usr/bin/env node

const colors = require('colors')
const readline = require("readline")
const fs = require('fs')
const server = require('../lib/server')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const arguments = process.argv.splice(2)
if(arguments.length === 0) {
    console.log(colors.red('Error, please specify at least one argument init or start'))
    process.exit(1)
} else if (arguments[0] === 'init') {
    //initialize server details
    rl.question('Which http port do you want to use? '+colors.yellow('\n[6001]'), function(httpPort) {
        rl.question('Enter redis host' + colors.yellow('\n[localhost]'), function(redisHost) {
            rl.question("Enter redis port " + colors.yellow('\n[6379]'), function(redisPort) {
                if (!httpPort) {
                    httpPort = 6001
                }
                if (!redisPort) {
                    redisPort = 6379
                }
                if (!redisHost) {
                    redisHost = 'localhost'
                }
                const json = {
                    'httpPort': httpPort,
                    'redisPort': redisPort,
                    'redisHost': redisHost
                }
                fs.writeFileSync('./sh-socket-config.json', JSON.stringify(json, null, 2))
                console.log(colors.green('Success, now run:\n') + colors.blue('sh-socket-server start') +'\n' + colors.green('to start your server'))
                process.exit(0);
            });
        })
    });
} else if(arguments[0] === 'start') {
    //start echo server
    fs.readFile('./sh-socket-config.json',(err, data) => {
        if (err) {
            console.log(colors.red('config file not found please run init command first: sh-socket-server init'))
            process.exit(1)
        } else {
            server.runServer(JSON.parse(data))
            console.log('server started')
        }
    })
}
rl.on("close", function() {
    console.log("\nBYE!");
    process.exit(0);
});
