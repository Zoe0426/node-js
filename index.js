console.log("arg2:", process.argv[2]);
if (process.argv[2] === "production") {
    require("dotenv").config({
        path: __dirname + "/production.env",
    });
} else {
    require("dotenv").config();
}

const { name } = require("ejs");
const express = require("express");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const db = require(__dirname + "/my_modules/mysql2");
const sessionStore = new MysqlStore({}, db);
const moment = require("moment-timezone");
const dayjs = require("dayjs");
const cors = require("cors");

// const multer=require('multer');
// const upload=multer({dest:'tmp_upload/'});
const upload = require(__dirname + "/my_modules/img_upload");

const app = express();

app.set("view engine", "ejs");

const whitelist = ["http://localhost:5500"];

const corsOptions = {
    credentials: true,
    origin: (origin, cb) => {
        console.log(origin);
        cb(null, true);
    },
};
app.use(cors(corsOptions));
app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: "fjdeoihdeogifhu",
        store: sessionStore,
        cookie: {
            maxAge: 1200_000,
        },
    })
);

// middleware top level
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 自訂 middleware
app.use((req, res, next) => {
    res.locals.title = "GB農場";

    res.locals.toDateString = (d) => {
        const fm = "YYYY-MM-DD";
        const djs = dayjs(d);
        return djs.format(fm);
    };
    next();
});

/*
const fm = "YYYY-MM-DD HH:mm:ss";
    const dayjs1 = dayjs();
    const dayjs2 = dayjs("2023/08/16");
    const d3 = new Date();
    const moment1 = moment();

    res.json({
        d1: dayjs1.format(fm),
        d2: dayjs2.format(fm),
        d3: d3,
        m1: moment1.format(fm),
        m2: moment1.tz("Europe/London").format(fm),
    });
    */
app.get("/", (req, res) => {
    res.render("home", { name: "GB" });
});

app.get("/", (req, res) => {
    res.send(`hello
<p>${process.env.DB_NAME}</p>
`);
});

app.get("/123", (req, res) => {
    res.json({
        name: "GB",
        age: 18,
    });
});

app.get("/json-sales", (req, res) => {
    const sales = require(__dirname + "/datas/sales");
    res.send(sales[0].name);
});

app.get("/json-sales2", (req, res) => {
    const sales = require(__dirname + "/datas/sales");
    res.render("json-sales2", { sales });
});

app.get("/try-qs", (req, res) => {
    res.json(req.query);
});

// const urlencodedParser=express.urlencoded({extended: false});
// const jsonParser=express.json();
app.post("/try-post", (req, res) => {
    res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
    res.render("try-post-form");
});
app.post("/try-post-form", (req, res) => {
    res.render("try-post-form", req.body);
});

app.post("/try-upload", upload.single("avatar"), (req, res) => {
    console.log(req.file);
    res.json(req.file);
});

app.post("/try-uploads", upload.array("photo", 10), (req, res) => {
    console.log(req.files);
    res.json(req.files.map((f) => f.filename));
});

app.get("/my-params1/:hello/:id", (req, res) => {
    res.json(req.params);
});

app.get(/^\/09\d{2}\-?\d{3}-?\d{3}$/, (req, res) => {
    let u = req.url.slice(1);
    u = u.split("?")[0];
    u = u.split("-").join("");
    res.json({ u });
});

app.use("/ab", require(__dirname + "/routes/member_list"));

app.get("/try-sess", (req, res) => {
    req.session.count = req.session.count || 0;
    req.session.count++;
    req.session.hello = "哈囉";
    res.json({
        count: req.session.count,
        hello: req.session.hello,
        session: req.session,
    });
});

app.get("/try-moment", (req, res) => {
    const fm = "YYYY-MM-DD HH:mm:ss";
    const dayjs1 = dayjs();
    const dayjs2 = dayjs("2023/08/16");
    const d3 = new Date();
    const moment1 = moment();

    res.json({
        d1: dayjs1.format(fm),
        d2: dayjs2.format(fm),
        d3: d3,
        m1: moment1.format(fm),
        m2: moment1.tz("Europe/London").format(fm),
    });
});

app.get("/try-db", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM mem_member LIMIT 2");
    res.json(rows);
});

app.get("/yahoo", async (req, res) => {
    fetch("https://tw.yahoo.com/")
        .then((r) => r.text())
        .then((txt) => {
            res.send(txt);
        });
});

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send(`<h1>找不到頁面唷~</h1>`);
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`啟動${port}`);
});
