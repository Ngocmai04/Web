import React, { useState } from "react";
import type { User } from "./App";

interface Props {
  onAdd: (user: User) => void;
}

const AddUser: React.FC<Props> = ({ onAdd }) => {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  const handleAdd = () => {
    if (!user.name || !user.username) {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setAdding(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {!adding ? (
        <button onClick={() => setAdding(true)}>➕ Thêm người dùng</button>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "300px" }}>
          <h4>Thêm người dùng</h4>
          <input id="name" placeholder="Name" value={user.name} onChange={handleChange} />
          <input id="username" placeholder="Username" value={user.username} onChange={handleChange} />
          <input id="email" placeholder="Email" value={user.email} onChange={handleChange} />
          <input id="street" placeholder="Street" value={user.address.street} onChange={handleChange} />
          <input id="suite" placeholder="Suite" value={user.address.suite} onChange={handleChange} />
          <input id="city" placeholder="City" value={user.address.city} onChange={handleChange} />
          <input id="phone" placeholder="Phone" value={user.phone} onChange={handleChange} />
          <input id="website" placeholder="Website" value={user.website} onChange={handleChange} />
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleAdd}>Lưu</button>
            <button onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
