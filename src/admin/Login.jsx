import { useState } from 'react';
import { authAPI } from './api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1a1a1a', fontSize: '24px' }}>Admin Login</h2>
      {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', cursor: 'pointer', backgroundColor: '#3d58c2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', transition: 'background-color 0.3s' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '25px', fontSize: '13px', color: '#666', textAlign: 'center', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
        Default: admin@example.com / password
      </p>
    </div>
  );
}

export default Login;
