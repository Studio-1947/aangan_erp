import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h1>Welcome to Aangan ERP</h1>
      <p>Manage your homestay efficiently.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login" style={{ color: '#fff', marginRight: '1rem' }}>Login</Link>
        <Link to="/register" style={{ color: '#fff' }}>Register</Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
