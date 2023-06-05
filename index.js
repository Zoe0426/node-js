console.log('arg2:',process.argv[2]);

if(process.argv[2]==='production'){
    require('dotenv').config({
        path:__dirname+'/production.env'
    });
}else{
    require('dotenv').config();
}

const express = require('express');


const app = express();

app.get('/',(req,res)=>{
res.send(`hello
<p>${process.env.DB_NAME}</p>
`);
});

const port = process.env.PORT || 3002;
app.listen(port,()=>{
console.log(`啟動${port}`);
});