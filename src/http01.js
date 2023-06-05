const http = require('node:http');

const server = http.createServer((req,res)=>{
res.writeHead(200,{
    'Content-Type':'text/html; charset=UTF-8;'
});
res.end(`
<h2>hello你好嗎?,我是GB</h2>
<h2>衷心感謝~珍重再見~期待再相逢~</h2>
<p>${req.url}</p> 


`);

});

server.listen(3000);