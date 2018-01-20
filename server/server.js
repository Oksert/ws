"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 8080;
var static1 = require('node-static');
var file = new static1.Server('../client/');


// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// latest 100 messages
var history = [];
// list of currently connected clients (users)
var clients = [];
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Array with some colors
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
// ... in random order
colors.sort(function (a, b) {
  return Math.random() > 0.5;
});
/**
 * HTTP server
 */
var server = http.createServer(function (request, response) {
  file.serve(request, response);
});
server.listen(webSocketsServerPort, "0.0.0.0");
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});
function broadcastUsers() {
  clients.forEach(function(client){
      client.channel.sendUTF(
        JSON.stringify({
          type: 'user_list',
          data: clients.map(function (elem) {
            return {
              name: elem.name,
              color: elem.color
            }
          })
        })
      )
  })  
}
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
  console.log((new Date()) + ' Connection from origin ' +
    request.origin + '.');
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);
  // we need to know client index to remove them on 'close' event
  var index;

  var userName = false;
  var userColor = false;
  if (clients.length > 0) {
    connection.sendUTF(
      JSON.stringify({
        type: 'user_list',
        data: clients.map(function (elem) {
          return {
            name: elem.name,
            color: elem.color
          }
        })
      })
    )
  }
  console.log((new Date()) + ' Connection accepted.');
  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
      JSON.stringify({
        type: 'history',
        data: history
      }));
    
  }
  // user sent some message
  connection.on('message', function (message) {
    
    if (message.type === 'utf8') { // accept only text
      // first message sent by user is their name
      connection.sendUTF(JSON.stringify({
        type: 'color',
        data: userColor
      }))
      if (userName === false) {
        
        // remember user name
        userName = htmlEntities(message.utf8Data);
        // get random color and send it back to the user
        userColor = colors.shift();
        index = clients.push({
          'channel': connection,
          'color':userColor,
          'name': userName
        }) - 1;
        clients.forEach(function (client) {
          client.channel.sendUTF(
            JSON.stringify({
              type: 'user_list',
              data: clients.map(function (elem) {
                return {
                  name: elem.name,
                  color: elem.color
                }
              })
            })
          );
        })

        console.log((new Date()) + ' User is known as: ' + userName +
          ' with ' + userColor + ' color.');
      } else { // log and broadcast the message
        console.log((new Date()) + ' Received Message from ' +
          userName + ': ' + message.utf8Data);

        // we want to keep history of all sent messages
        var obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        };
        history.push(obj);
        history = history.slice(-100);
        // broadcast message to all connected clients
        var json = JSON.stringify({
          type: 'message',
          data: obj
        });
        for (var i = 0; i < clients.length; i++) {
          clients[i].channel.sendUTF(json);
        }
      }
    }
  });
  // user disconnected
  connection.on('close', function (connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer " +
        connection.remoteAddress + " disconnected.");
      // remove user from the list of connected clients
      clients.splice(index, 1);
      broadcastUsers()
      // push back user's color to be reused by another user
      colors.push(userColor);
    }
  });
});