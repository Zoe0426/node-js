const express = require("express");
const db = require(__dirname + "/../modules/mysql2");
const router = express.Router();

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

    let where = " WHERE 1 ";
    if (keyword) {
        const kw_escaped = db.escape("%" + keyword + "%");
        where += ` AND ( 
      \`name\` LIKE ${kw_escaped} 
      OR
      \`address\` LIKE ${kw_escaped}
      )
    `;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0;
    let rows = [];
    if (totalRows) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            output.redirect = req.baseUrl + "?page=" + totalPages;
            return output;
        }
        const sql = ` SELECT * FROM address_book ${where} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        [rows] = await db.query(sql);
    }
    output = { ...output, totalRows, perPage, totalPages, page, rows };
    return output;
};

router.get("/api", async (req, res) => {
    res.json(await getListData(req));
});

router.get("/", async (req, res) => {
    const output = await getListData(req);

    if (output.redirect) {
        return res.redirect(output.redirect);
    }
    res.render("address-book/index", output);
});

router.get("/escape", async (req, res) => {
    res.json({
        c1: db.escape("abc"),
        c2: db.escape("abc"),
        c3: db.escape("a'bc"),
    });
});
module.exports = router;
