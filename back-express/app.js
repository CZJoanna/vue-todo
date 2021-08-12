// 載入 express 並架起伺服器
const express = require("express");
const app = express();
//設定 port 號 3000
const port = 3000;

// 伺服器啟動後開始監聽這個服務窗口，有從這個窗口進來的瀏覽器請求，就會被受理～
app.listen(port, () => {
  console.log("App is running ");
});
