import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import CreateHomestay from './pages/CreateHomestay';
import Rooms from './pages/Rooms';
import Header from './components/Header';
import { Button } from '@/components/ui/button';
import { AuthProvider } from './context/AuthContext';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight lg:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Aangan ERP
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Manage your homestay efficiently. A modern platform for seamless property management.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Toaster } from 'sileo';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Auth Routes (Public Only) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          import Rooms from './pages/Rooms';

          // ... existing imports

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Header />
                <CreateHomestay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Header />
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
