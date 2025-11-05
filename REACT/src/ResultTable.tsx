import React, { useEffect, useState } from "react";
import type { User } from "./App";

interface Props {
  keyword: string;
  user: User | null;
  onAdded: () => void;
}

const ResultTable: React.FC<Props> = ({ keyword, user, onAdded }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<User | null>(null);

  // tải dữ liệu 1 lần
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // thêm người dùng mới
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  const removeUser = (id: number | undefined) => {
    if (!id) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const editUser = (u: User) => {
    setEditing({ ...u, address: { ...u.address } });
  };

  const handleEditChange = (field: keyof User | "address.city", value: string) => {
    if (!editing) return;
    if (field === "address.city") {
      setEditing({ ...editing, address: { ...editing.address, city: value } });
    } else {
      setEditing({ ...editing, [field]: value } as User);
    }
  };

  const saveUser = () => {
    if (!editing) return;
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
    setEditing(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={{ marginTop: "10px", border: "1px solid #aaa", padding: "10px" }}>
          <h4>Chỉnh sửa người dùng</h4>
          <input
            type="text"
            value={editing.name}
            onChange={(e) => handleEditChange("name", e.target.value)}
          />
          <input
            type="text"
            value={editing.username}
            onChange={(e) => handleEditChange("username", e.target.value)}
          />
          <input
            type="text"
            value={editing.email}
            onChange={(e) => handleEditChange("email", e.target.value)}
          />
          <input
            type="text"
            value={editing.address.city}
            onChange={(e) => handleEditChange("address.city", e.target.value)}
          />
          <div>
            <button onClick={saveUser}>Lưu</button>
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
