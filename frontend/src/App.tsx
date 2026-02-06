import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateHomestay from './pages/CreateHomestay';
import Header from './components/Header';

const Home = () => {
  return (
    <div className="text-center text-white p-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
        Aangan ERP
      </h1>
      <p className="text-xl opacity-80 mb-8 font-light">Manage your homestay efficiently.</p>
      
      <div className="flex justify-center gap-6">
        <Link 
          to="/login" 
          className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-3 bg-primary hover:bg-primary-hover border border-transparent rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-primary/30"
        >
          Register
        </Link>
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
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Header />
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Header />
              <CreateHomestay />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
