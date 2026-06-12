// MonthInput.tsx
import React from "react";

interface MonthInputItems {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function MonthInput({value, onChange}: MonthInputItems) {
  // CSS
  const styles = {
    input: {
      display: 'block',
      width: '145px',
      padding: '5px',
      color: '#333333',
      borderRadius: '4px',
      marginBottom: '10px'
    }
  };
  
  return (
    <>
      <input type="month" value={value} onChange={onChange} style={styles.input}></input>
    </>
  );
}

export default MonthInput;