import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();

    const newStudent = {
      name,
      age: Number(age),
      studentClass,  
    };

    axios.post("http://localhost:5000/api/students", newStudent)
      .then(res => {
        setStudents([...students, res.data]);
        setName("");
        setAge("");
        setStudentClass("");
      })
      .catch(err => console.error("Lỗi khi thêm học sinh:", err));
  };

  return (
    <div>
      <h1>Danh sách học sinh</h1>

      {students.length === 0 ? (
        <p>Chưa có học sinh nào.</p>
      ) : (
        <ul>
          {students.map(st => (
            <li key={st._id}>
              {st.name} - {st.age} - {st.studentClass}
            </li>
          ))}
        </ul>
      )}

      <h2>Thêm học sinh mới</h2>
      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Tuổi"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Lớp"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          required
        />

        <button type="submit">Thêm học sinh</button>
      </form>
    </div>
  );
}

export default App;
