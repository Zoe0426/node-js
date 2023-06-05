const http = require('node:http');
const fs =require('node:fs/promises');

const server = http.createServer(async(req,res)=>{
res.writeHead(200,{
    'Content-Type':'text/plain; charset=UTF-8;'
});
const str = JSON.stringify(req.headers,null,4);
// await fs.writeFile('./headers01.txt',str);//工作目錄下
await fs.writeFile(__dirname+'/headers01.txt',str);//目前檔案目錄下

res.end(str);

});

server.listen(3000);