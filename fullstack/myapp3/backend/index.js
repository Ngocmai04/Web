const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Lấy URI từ biến môi trường

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối:", err));

// Import model Student
const Student = require('./src/Student');

const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Không thể kết nối tới MongoDB. Hãy đảm bảo container Mongo đang chạy.'
    });
  }
  return next();
};

// Route API lấy danh sách học sinh
app.get('/api/students',ensureDbConnected, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/students',ensureDbConnected, async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Thiết lập cổng
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
