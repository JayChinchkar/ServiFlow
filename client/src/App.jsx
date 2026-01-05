import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // Simple check to see if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      {/* Updated background to match the new Midnight Emerald theme */}
      <div className="min-h-screen bg-[#05070a] selection:bg-emerald-500/30">
        <Routes>
          {/* 1. Landing Page is now the Root */}
          <Route path="/" element={<Home />} />

          {/* 2. Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 3. Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          {/* 4. Redirect any unknown routes back to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;