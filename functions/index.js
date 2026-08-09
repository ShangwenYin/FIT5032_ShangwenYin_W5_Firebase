// 9.4.1 - 2.1: onRequest 映射 firebase-functions
const functions = require("firebase-functions");
// 9.4.1 - 2.2: admin 引用 Firebase Admin SDK（连接 Firestore）
const admin = require("firebase-admin");
// 9.4.1 - 2.3: cors 避免 CORS 策略错误（见 9.1.2）
const cors = require("cors")({ origin: true });

admin.initializeApp();

// 9.4.1 - 2.4: 创建云函数 countBooks
exports.countBooks = functions.https.onRequest((req, res) => {
  // 9.4.1 - 2.5: 逻辑——按关键字 "books" 读取集合
  // 9.4.1 - 2.6: 使用 try / catch 包裹 2.5
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection("books").get();
      const count = snapshot.size;
      res.json({ count });
    } catch (error) {
      console.error("Error counting books:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
