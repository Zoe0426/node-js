console.log('arg2:', process.argv[2]);
;


if (process.argv[2] === 'production') {
    require('dotenv').config({
        path: __dirname + '/production.env'
    });
} else {
    require('dotenv').config();
}

const express = require('express');


const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { name: 'GB' });
});

app.get('/', (req, res) => {
    res.send(`hello
<p>${process.env.DB_NAME}</p>
`);
});

app.get('/123', (req, res) => {
    res.json({
        name: 'GB',
        age: 18,
    })
});

app.get('/json-sales', (req, res) => {
    const sales = require(__dirname + '/datas/sales');
    res.send(sales[0].name);
});

app.get('/json-sales2', (req, res) => {
    const sales = require(__dirname + '/datas/sales');
    res.render('json-sales2', { sales });
});

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));


app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send(`<h1>找不到頁面唷~</h1>`)
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`啟動${port}`);
});

