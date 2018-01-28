const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const SocketHandler = require('./utils/routes'); 
const configServer = require('./utils/config'); 
const sassMiddleware = require('node-sass-middleware')
 
 
class Server{
 
    constructor(){
        this.port =  process.env.PORT || 3000;
        this.host = `localhost`;
        
        this.app = express();
        this.http = http.Server(this.app);
        // this.socket = socketio(this.http);
    }
 
    appConfig(){        
       

        this.app.use('/dist', express.static('dist'));
        
    }

    /* Including app Routes ends*/  
 
    appExecute(){
 
        this.appConfig();
        new SocketHandler(this.http)
        this.app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname + '/dist/index.html'));
        });
        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
        
    }
 
}
 
const app = new Server();
app.appExecute();