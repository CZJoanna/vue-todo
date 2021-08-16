// 載入 express 並架起伺服器
const express = require("express");
// 引用 body-parser -> ! 請直接用 express 替代 !
// const bodyParser = require("body-parser");
const app = express();

//設定 port 號 3000
const port = 3000;

// 引入cors 並預設為全開放
const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 載入 mysql
const mysql = require("mysql");
// 連線物件
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "jyun",
  password: "1212",
  database: "todo-list",
  connectionLimit: 10,
});
// 連線資料庫
conn.connect(function (err) {
  if (err) {
    console.log(JSON.stringify(err));
    return;
  } else {
    console.log("已連接到mysql");
  }
});

// 伺服器啟動後開始監聽這個服務窗口，有從這個窗口進來的瀏覽器請求，就會被受理～
app.listen(port, () => {
  console.log("App is running ");
});

//讀取全部資料
app.get("/", (req, res) => {
  conn.query("select * from todo", "", function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    } else {
      res.send(JSON.stringify(rows));
    }
  });
});

//新增一筆資料
app.post("/", (req, res) => {
  //瀏覽器送過來要進入資料庫的物件
  console.log(req.body); //{...}
  conn.query(
    "insert into todo (title,completed) " + "values(?,?)",
    [req.body.title, req.body.completed],
    function (err, rows) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.send(rows);
      }
    }
  );
});

//刪除一筆資料
app.delete("/", (req, res) => {
  console.log(req.body);
  const selectedId = req.body.id; //number
  conn.query(`delete from todo where id =${selectedId}`);
  res.send("oh yeah 刪掉了");
});
