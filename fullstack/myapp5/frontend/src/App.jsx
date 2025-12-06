import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
    const newStudent = { name, age: Number(age), studentClass };
    axios.post("http://localhost:5000/api/students", newStudent)
      .then(res => {
        setStudents(prev => [...prev, res.data]);
        setName(""); setAge(""); setStudentClass("");
      })
      .catch(err => console.error("Lỗi khi thêm học sinh:", err));
  };

  // Hàm chỉnh sửa thông tin học sinh
  const handleUpdateStudent = (e) => {
    e.preventDefault();
    const updateStu = { name, age: Number(age), studentClass };
    axios.put(`http://localhost:5000/api/students/${currentStudentId}`, updateStu)
      .then((res) => {
        setStudents(prev => prev.map(st => st._id === res.data._id ? res.data : st));
        setName(""); setAge(""); setStudentClass(""); setCurrentStudentId(null);
        navigate("/");
      })
      .catch(err => console.error("Lỗi khi cập nhật học sinh:", err));
  };

  // Hàm xóa học sinh
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(() => setStudents(prev => prev.filter(st => String(st._id) !== String(id))))
      .catch(err => console.error("Lỗi khi xóa học sinh:", err));
  };

  // Hàm xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) handleUpdateStudent(e);
    else handleAddStudent(e);
  };

  // Lọc danh sách theo từ khóa
  const filteredStudents = students.filter(st =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h1 className="text-center">Danh sách học sinh</h1>

      {/* Ô tìm kiếm */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm học sinh theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Danh sách học sinh */}
      {filteredStudents.length === 0 ? (
        <p>Không có học sinh nào khớp với từ khóa.</p>
      ) : (
        <ul className="list-group my-4">
          {filteredStudents.map(st => (
            <li key={st._id} className="list-group-item">
              <strong>{st.name}</strong> — {st.age} tuổi — Lớp {st.studentClass}
              <button
                className="btn btn-warning btn-sm float-end"
                onClick={() => navigate(`/edit/${st._id}`)}
              >
                Sửa
              </button>
              <button
                className="btn btn-danger btn-sm float-end me-2"
                onClick={() => handleDelete(st._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}

      {/* FORM thêm/sửa */}
      <h2 className="my-4">{isEditing ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Họ tên</label>
          <input type="text" id="name" className="form-control"
            placeholder="Nhập họ tên" value={name}
            onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Tuổi</label>
          <input type="number" id="age" className="form-control"
            placeholder="Nhập tuổi" value={age}
            onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="className" className="form-label">Lớp</label>
          <input type="text" id="className" className="form-control"
            placeholder="Nhập lớp" value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isEditing ? "Cập nhật học sinh" : "Thêm học sinh"}
        </button>
      </form>
    </div>
  );
}

export default App;
