import { useState } from "react";
import SearchForm from "./SearchForm";
import AddUser from "./AddUser";
import ResultTable from "./ResultTable";

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
  phone: string;
  website: string;
}

function App() {
  const [keyword, setKeyword] = useState<string>("");
  const [newUser, setNewUser] = useState<User | null>(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable keyword={keyword} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  );
}

export default App;
