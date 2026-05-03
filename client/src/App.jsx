import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LoginLanding from './pages/LoginLanding';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProjectDetails from './pages/ProjectDetails';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<LoginLanding />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} replace /> : <Signup />} />
      
      <Route path="/admin/*" element={
        <ProtectedRoute role="Admin">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>
        </ProtectedRoute>
      } />
      
      <Route path="/employee/*" element={
        <ProtectedRoute role="Member">
          <MemberDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
