const express = require("express");
const db = require(__dirname + "/../my_modules/mysql2");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = 25;
    let keyword = req.query.keyword || '';
  let page = req.query.page ? +req.query.page : 1;
  if (!page || page < 1) {
    return res.redirect(req.baseUrl);
  }

  let where = 'WHERE 1';
  if(keyword){
    where += ` AND \`member_name\` LIKE ${ db.escape('%'+keyword+'%') } `;
  }

  const t_sql = `SELECT COUNT(1) totalRows FROM mem_member`;
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0;
  let rows=[];
  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(req.baseUrl + `?page=${totalPages}`);
    };

    const sql = ` SELECT * FROM mem_member ${where} LIMIT ${perPage*(page-1)}, ${perPage}`;
    [rows] = await db.query(sql);
  }

  res.json({ totalRows, perPage, totalPages, page, rows});
});

// escape 說明
router.get('/escape',async(req,res)=>[
res.json({
  c1: db.escape('abc'),
  c2: db.escape("abc"),
  c3: db.escape("a'bc"),
})
]);

module.exports = router;
