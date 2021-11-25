# sh-socket-server

To install run 
>npm install sh-socket-server

Install redis server if it does not exist already 

Create a .env in the root directory if it does not exist and specify redis host and port

>REDIS_HOST=localhost
>REDIS_PORT=6379

To run the server

>npm run start

You can use pm2 to run and monitor it. It will restart in case it fails
