import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Danh sách học sinh</h1>
      {students.length === 0 ? (
        <p>Chưa có học sinh nào.</p>
      ) : (
        <ul>
          {students.map(st => (
            <li key={st._id}>{st.name} - {st.age} - {st.class}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
