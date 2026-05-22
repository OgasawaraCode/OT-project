// Profile.jsx
function Profile() {
  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #333',
      borderRadius: '12px',
      backgroundColor: '#fafafa',
      maxWidth: '400px',
      margin: '20px auto',
      textAlign: 'center',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#007bff',
      display: 'inline-block',
      lineHeight: '100px',
      color: 'white',
      fontSize: '32px',
      marginBottom: '15px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.avatar}>👤</div>
      <h2>～～～～ / 開発者</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        プロフィールページです。
      </p>
    </div>
  );
}

export default Profile;