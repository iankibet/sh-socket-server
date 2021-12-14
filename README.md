# sh-socket-server

To install run 
>npm install -g sh-socket-server

Install redis server if it does not exist already 

After that, initialize redis server to set redis host , port and http port to run the server

>sh-socket-server init

To run the server

>sh-socket-server start

You can use pm2 to run and monitor it. It will restart in case it fails

