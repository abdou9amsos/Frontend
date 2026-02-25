import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('admin@smart.com'); 
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/'); 
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="brand">
          <div className="logo">
              <span className="logo-strong">SMART</span><span className="logo-soft">FIND</span>
          </div>
        </div>
        
        <h2>Connexion</h2>
        
        {error && <div className="chip chip-busy" style={{width:'100%', justifyContent:'center', marginBottom:'16px'}}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <input 
            type="email" 
            className="input" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="input" 
            placeholder="Mot de passe" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Se connecter</button>
        </form>

        <Link to="/signup" className="auth-link">Créer un compte</Link>
      </div>
    </div>
  );
};

export default Login;