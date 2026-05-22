// App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Btn from './Btn';
import Card from './Card';
import Profile from './Profile';

function Home() {
  return (
    <div>
      <Card />
      <div>
        <Btn />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>マイ・アプリの画面</h1>
        <p>ここが全体のボス（ベース）になる場所です。</p>

        <nav>
          <Link to="/">ホーム</Link> | 
          <Link to="/profile">プロフィール</Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;