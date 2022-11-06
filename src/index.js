const express = require('express')
const path = require('path')
const http= require('http')
const socketio= require('socket.io')
const Filter=require('bad-words');
const { generateMessage,generateLocation } = require('./utils/message')
const {addUser, removeUser,getUser,getUsersInRoom} = require('./utils/users')

app=express();
const server = http.createServer(app)
const io = socketio(server)


//define port number
var port =process.env.PORT || 3000;

const pathDirectory = path.join(__dirname,'../public');

app.use(express.static(pathDirectory));

//connection established 
io.on('connection',(socket)=>{
    console.log('web socket connected');

socket.on('join',(options,callback)=>{
    const {error,user}= addUser({id:socket.id,...options})
    if(error){
        return callback(error);
    }

        socket.join(user.room)

socket.emit('message',generateMessage('Admin','Welcome!'));

//message display if any user join
socket.broadcast.to(user.room).emit('message',generateMessage('Admin',user.username+' is joined'))
  io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUsersInRoom(user.room)
  })

    })

//filter is used for decline bad-words
socket.on('sendMessage',(message,callback)=>{
   const user = getUser(socket.id);
    const filter= new Filter();
    if(filter.isProfane(message))
    {
      return callback('Profanity is not allowed')
    }
    
    io.to(user.room).emit('message',generateMessage(user.username,message));
    callback()
    })


    //location is shared
socket.on('sendLocation',(coords,callback)=>{
    const user=getUser(socket.id);

    io.to(user.room).emit('locationshare',generateLocation(user.username ,'https://google.com/maps?q=${coords.latitude},${coords.longtitude}'))
    callback()
})

     //disconnect if user left 
    socket.on('disconnect',()=>{
        const user = removeUser({id:socket.id});
        if(user){
            io.to(user.room).emit('message',generateMessage( 'Admin',user.username+' is left!'));
            io.to(user.room).emit('roomData',{
                room:user.room,
      users:getUsersInRoom(user.room)
            })
        }
        
    })
})
    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('countUpdated',count)
    // })


    //host to server with port number 4000
    //define port number in the 13 line of code
server.listen(port,()=>{
    console.log('server started '+port);
})
