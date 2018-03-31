var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

//默认打开文件
app.get('/', function(req, res){
    res.sendfile('index.html');
});


//用于存储所有socket以广播数据
var iolist = [];

//定义socket on connection（连入）事件行为
io.on('connection', function(socket){
    iolist.push(socket); 
    
     if (iolist.length <= 0) return;
      for (i in iolist) {
           iolist[i].emit('trends', 'ok');
         iolist[i].emit('message', 'trends');
         iolist[i].emit('anything', "trends");
        // 向客户端发送trends数据
        iolist[i].emit('trends', "trends");
        // 向客户端发送coins数据
        iolist[i].emit('coins', "coins");
    }

  
    console.log(socket);
    //将连入socket加入列表
    // iolist.push(socket); 
    //记录index，在disconnect（断开连接）发生时将对应的socket删除
    var sockex = iolist.indexOf(socket); 
    //定义on disconnect事件行为
    socket.on('disconnect', function(){
        console.log('disconnect');
        //将断开连接的socket从广播列表里删除
        iolist.splice(sockex, 1);
    });

    socket.on('message', function(message, callback) {
        console.log(message);
    })
    socket.on('anything', function(data) {
         console.log(data);
    })
});

// 数据广播进程:每1秒钟广播一次
setInterval(function() {

    // 如果没有正在连接的socket，直接返回；
    if (iolist.length <= 0) return;
    var trends = fs.readFileSync('./data/trends.json','utf-8');//trends数据
    var coins = fs.readFileSync('./data/coins.json','utf-8');//coins数据

    //向所有socket连接发送数据
    for (i in iolist) {

         iolist[i].emit('message', trends);
         iolist[i].emit('anything', trends);
        // 向客户端发送trends数据
        iolist[i].emit('trends', trends);
        // 向客户端发送coins数据
        iolist[i].emit('coins', coins);
    }
   io.emit('message', trends);
}, 1000);

// 服务器侦听在sockettest.com的3000端口上
http.listen(3000, function(){
    // 输出到标准输出
    console.log('listening on websocketserver.phptest.easytonetech.com:3000');
});