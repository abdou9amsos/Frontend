import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/signup', formData);
      alert("Compte créé ! Connectez-vous.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'inscription.");
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
        
        <h2>Inscription</h2>
        
        {error && <div className="chip chip-busy" style={{width:'100%', justifyContent:'center', marginBottom:'16px'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <div style={{display:'flex', gap:'10px'}}>
            <input className="input" placeholder="Nom" onChange={e=>setFormData({...formData, nom:e.target.value})} required style={{flex:1}} />
            <input className="input" placeholder="Prénom" onChange={e=>setFormData({...formData, prenom:e.target.value})} required style={{flex:1}} />
          </div>
          <input type="email" className="input" placeholder="Email" onChange={e=>setFormData({...formData, email:e.target.value})} required />
          <input type="password" className="input" placeholder="Mot de passe" onChange={e=>setFormData({...formData, password:e.target.value})} required />

          <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Créer mon compte</button>
        </form>

        <Link to="/login" className="auth-link">Déjà un compte ? Se connecter</Link>
      </div>
    </div>
  );
};

export default Signup;