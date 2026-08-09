// 阿里云函数计算 (FC) Web 函数 countBooks —— Express 服务器格式
// 适用：创建函数时选了 Web 函数 / nodejs-express 模板（FC 会以 npm start 启动本服务器）
// 部署区域：香港 (cn-hongkong) 或新加坡 (ap-southeast-1) —— 海外区域才能访问 Google Firestore
//
// 部署要求：
// 1. 以 zip 代码包方式上传（含 node_modules），不要用在线编辑器粘贴
// 2. 运行环境 Node.js 18/20
// 3. 配置环境变量 FIRESTORE_SERVICE_ACCOUNT = Firebase 服务账号 JSON 完整字符串
'use strict';

const express = require('express');
const admin = require('firebase-admin');

// 从环境变量读取 Firebase 服务账号密钥（在 FC 控制台配置）
const serviceAccountJson = process.env.FIRESTORE_SERVICE_ACCOUNT;
if (serviceAccountJson) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
  });
} else {
  admin.initializeApp();
}

const app = express();

// CORS：允许浏览器跨域访问
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// countBooks 逻辑：读取 Firestore books 集合数量
app.get('/', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('books').get();
    res.json({ count: snapshot.size });
  } catch (error) {
    console.error('Error counting books:', error);
    res.status(500).json({ error: error.message });
  }
});

// FC Web 函数通过 FC_SERVER_PORT 环境变量指定监听端口（默认 9000）
const port = process.env.FC_SERVER_PORT || process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`countBooks server listening on port ${port}`);
});
