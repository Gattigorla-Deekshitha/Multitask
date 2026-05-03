import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Members from './pages/Members';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for storage changes (to handle login in same tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem('token'))} />} />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/settings" element={<Settings onLogout={() => setToken(null)} />} />
                </Routes>
              </Layout>
            ) : (
              <Login onLogin={() => setToken(localStorage.getItem('token'))} />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
