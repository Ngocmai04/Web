import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [currentStudentId, setCurrentStudentId] = useState(null); // ID học sinh đang sửa
  const { id } = useParams();  // Lấy id từ URL khi đang chỉnh sửa học sinh
  const navigate = useNavigate();
  
  // Derived state: isEditing từ id parameter
  const isEditing = !!id;
  

  // Lấy danh sách học sinh
  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Lấy thông tin học sinh khi đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/students/${id}`)
        .then((res) => {
          setName(res.data.name);
          setAge(res.data.age);
          setStudentClass(res.data.studentClass);
          setCurrentStudentId(res.data._id);
        })
        .catch(err => console.error("Lỗi fetch học sinh:", err));
    }
  }, [id]);

  // Hàm thêm học sinh mới
  const handleAddStudent = (e) => {
    e.preventDefault();

    const newStudent = {
      name,
      age: Number(age),
      studentClass,
    };

    axios.post("http://localhost:5000/api/students", newStudent)
      .then(res => {
        setStudents(prev =>[...prev, res.data]);
        setName("");
        setAge("");
        setStudentClass("");
      })
      .catch(err => console.error("Lỗi khi thêm học sinh:", err));
  };

  // Hàm chỉnh sửa thông tin học sinh
  const handleUpdateStudent = (e) => {
    e.preventDefault();

    const updateStu = {
      name,
      age: Number(age),
      studentClass,
    };

    axios.put(`http://localhost:5000/api/students/${currentStudentId}`, updateStu)
      .then((res) => {
        // Cập nhật lại danh sách học sinh
        setStudents(prev => prev.map(st => st._id === res.data._id ? res.data : st));
        setName("");
        setAge("");
        setStudentClass("");
        setCurrentStudentId(null);
        navigate("/");  // Quay lại trang danh sách
      })
      .catch(err => console.error("Lỗi khi cập nhật học sinh:", err));
  };

  // Hàm xử lý submit tùy vào chế độ
  const handleSubmit = (e) => {
    if (isEditing) {
      handleUpdateStudent(e);
    } else {
      handleAddStudent(e);
    }
  };

  return (
    <div className="container my-5">

      <h1 className="text-center">Danh sách học sinh</h1>

      {students.length === 0 ? (
        <p>Chưa có học sinh nào.</p>
      ) : (
        <ul className="list-group my-4">
          {students.map(st => (
            <li key={st._id} className="list-group-item">
              <strong>{st.name}</strong> — {st.age} tuổi — Lớp {st.studentClass}
              <button 
                className="btn btn-warning btn-sm float-end"
                onClick={() => navigate(`/edit/${st._id}`)}
              >
                Sửa
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* FORM */}
      <h2 className="my-4">{isEditing ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}</h2>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Họ tên</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Nhập họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">Tuổi</label>
          <input
            type="number"
            id="age"
            className="form-control"
            placeholder="Nhập tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="className" className="form-label">Lớp</label>
          <input
            type="text"
            id="className"
            className="form-control"
            placeholder="Nhập lớp"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          {isEditing ? "Cập nhật học sinh" : "Thêm học sinh"}
        </button>
      </form>
    </div>
  );
}

export default App;
