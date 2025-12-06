const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  studentClass: { type: String, required: true }
}, { collection: 'students' });

module.exports = mongoose.model('Student', studentSchema);
