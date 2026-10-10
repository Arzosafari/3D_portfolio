import { useState, useEffect } from 'react';
import Login from './Login';
import Projects from './Projects';
import TeamMembers from './TeamMembers';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('projects');

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#2c3e50', padding: '15px 20px', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '600' }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentView('projects')}
              style={{
                background: currentView === 'projects' ? '#34495e' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
              }}
            >
              Projects
            </button>
            <button
              onClick={() => setCurrentView('team')}
              style={{
                background: currentView === 'team' ? '#34495e' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
              }}
            >
              Team Members
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {currentView === 'projects' && <Projects />}
        {currentView === 'team' && <TeamMembers />}
      </main>
    </div>
  );
}

export default AdminPanel;
