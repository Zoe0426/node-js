const dayjs = require("dayjs");
const express = require("express");
const db = require(__dirname + "/../my_modules/mysql2");
const router = express.Router();
const upload = require(__dirname + "/../my_modules/img_upload");

const getListData = async (req) => {
    let output = {
        redirect: "",
        totalRows: 0,
        perPage: 25,
        totalPages: 0,
        page: 1,
        rows: [],
    };
    const perPage = 25;
    let keyword = req.query.keyword || "";
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if (!page || page < 1) {
        output.redirect = req.baseUrl;
        return output;
    }

    let where = "WHERE 1";
    if (keyword) {
        const kwd_escaped = db.escape("%" + keyword + "%");
        where += ` AND (
        \`member_name\` LIKE ${kwd_escaped}
        OR 
        \`member_level\` LIKE ${kwd_escaped}
    )
    `;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM mem_member ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0;
    let rows = [];
    if (totalRows) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            output.redirect = req.baseUrl + "?page=" + totalPages;
            return output;
        }

        const sql = ` SELECT * FROM mem_member ${where} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        [rows] = await db.query(sql);
    }
    output = { ...output, totalRows, perPage, totalPages, page, rows, keyword };
    return output;
};

router.use((req, res, next) => {
    res.locals.title = "會員清單 | " + res.locals.title;
    next();
});

router.get("/add", async (req, res) => {
    res.render("member-list/add");
});

router.post("/", upload.none(), async (req, res) => {
    const sql = `INSERT INTO mem_member(
    member_name, member_email, member_password, member_mobile, member_gender, member_birth, 
    member_pet, member_level, member_ID, 
    member_profile, create_time, update_time) VALUES (?, ?, ?, 
    ?, ?, ?,
    ?, ?, ?,
    ?, NOW(), NOW())`;

    let birthday = dayjs(req.body.birthday);
    if (birthday.isValid()) {
        birthday = birthday.format("YYYY-MM-DD");
    } else {
        birthday = null;
    }

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.mobile,
        req.body.gender,
        birthday,
        req.body.pet,
        req.body.level,
        req.body.id,
        req.body.profile,
    ]);

    res.json(req.body);
});

router.get("/api", async (req, res) => {
    res.json(await getListData(req));
});

router.get("/", async (req, res) => {
    const output = await getListData(req);

    if (output.redirect) {
        return res.redirect(output.redirect);
    }
    res.render("member-list/index", output);
});

router.delete("/:member_sid", async (req, res) => {
    const { member_sid } = req.params;
    const sql = `DELETE FROM mem_member WHERE member_sid=?`;
    const [result] = await db.query(sql, [member_sid]);

    res.json({ ...result, member_sid });
});

// escape 說明
router.get("/escape", async (req, res) => [
    res.json({
        c1: db.escape("abc"),
        c2: db.escape("abc"),
        c3: db.escape("a'bc"),
    }),
]);

module.exports = router;
