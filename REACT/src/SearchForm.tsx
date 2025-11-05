import React from "react";

interface Props {
  onChangeValue: (value: string) => void;
}

const SearchForm: React.FC<Props> = ({ onChangeValue }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Tìm theo name hoặc username"
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
};

export default SearchForm;
