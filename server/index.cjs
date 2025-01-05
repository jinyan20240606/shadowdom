const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 模拟加载超时的 CSS 文件
app.get('/timeout.css', (req, res) => {
  // 设置超时时间，单位为毫秒
  const TIMEOUT_MS = 10 * 1000; // 10 秒

  // 使用 setTimeout 来模拟延迟
  setTimeout(() => {
    // 这里可以选择发送 CSS 内容或者直接结束连接以模拟超时
    // 发送 CSS 内容
    const cssFilePath = path.join(__dirname, 'styles', 'style.css');
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'text/css');
        res.send(data);
      }
    });
    
    // 或者直接结束连接以模拟超时
    // res.end();
  }, TIMEOUT_MS);

  // 如果你想立即返回一个临时响应，可以在这里做
  // res.status(202).send('CSS loading...');
});

// 提供静态文件服务（如 HTML、JS）
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});