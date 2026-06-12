// TextInput.tsx
import React from "react";

interface TextInputItems {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({value, onChange}: TextInputItems) {
  // CSS
  const styles = {
    input: {
      display: 'block',
      width: '145px',
      padding: '5px',
      color: '#333333',
      borderRadius: '4px',
      marginBottom: '10px'
    },
    label: {
      display: 'block',
      width: '170px',
      height: '25px',
      marginTop: '5px',
      marginBottom: '10px'
    },
    p: {
      fontSize: '10px',
      color: '#666',
      marginTop: '0',
      marginBottom: '10px',
      lineHeight: '1.2'
    }
  };

  return (
    <>
      <label>×日／休日を記入↓</label>
      <input type="text" value={value} onChange={onChange} style={styles.input}></input>
      <p style={styles.p}>※入力例：1,2-4,5am,6pm,7~15休<br/>※5-7pmなどの範囲指定も可</p>
    </>
  );
}

export default TextInput;