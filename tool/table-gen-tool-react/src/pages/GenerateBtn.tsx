// GenerateBtn.tsx
import React from 'react';
interface GenerateBtnItems {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function GenerateBtn({onClick}: GenerateBtnItems) {
  // CSS
  const styles = {
    btn: {
      display: 'block',
      padding: '4px 12px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      borderRadius: '4px',
      border: 'none',
      marginBottom: '8px'
    }
  };

  return (
    <>
    <button style={styles.btn} onClick={onClick}>実行</button>
    </>
  );
}

export default GenerateBtn;