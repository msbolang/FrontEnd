var app=require("http").createServer(handler);
var io=require("socket.io")(app);
var fs=require("fs");
app.listen(8000);
function handler(req,res){
    fs.readFile('index.html',function(err,data){
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html')
        }
        res.writeHead(200);
        res.end(data);
    });
}
// console.log('io',io);
io.on('connection',function(socket){
    socket.emit('broadcast news',{hello:'world'});//广播消息
    socket.on('listen client',function(data){
        console.log("ccc",data);
        console.log("client messages",data);
    })//监听所有的客户端发来的消息
})