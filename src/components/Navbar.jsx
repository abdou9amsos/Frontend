import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      api.get('/users/me')
         .then(res => setUser(res.data))
         .catch(() => {
           localStorage.removeItem('access_token');
           navigate('/login');
         });
    }
  }, [token, navigate]);

  if (!token || ['/login', '/signup'].includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="topbar">
      <div className="brand">
        <button className="icon-btn" aria-label="Recherche" onClick={() => navigate('/search')}>
            <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <div className="logo">
            <span className="logo-strong">SMART</span><span className="logo-soft">FIND</span>
        </div>
      </div>

      <nav className="nav">
        {/* LIENS GLOBAUX */}
        <Link className={`nav-item ${isActive('/')}`} to="/">
            <i className="fa-solid fa-house"></i><span>Accueil</span>
        </Link>
        <Link className={`nav-item ${isActive('/carte')}`} to="/carte">
            <i className="fa-solid fa-map"></i><span>Carte</span>
        </Link>
        <Link className={`nav-item ${isActive('/categories')}`} to="/categories">
            <i className="fa-solid fa-grid-2"></i><span>Catégories</span>
        </Link>
        
        {/* LIENS ADMIN UNIQUEMENT */}
        {user?.role === 'Admin' && (
            <>
                <Link className={`nav-item ${isActive('/admin/inventory')}`} to="/admin/inventory" style={{color:'var(--primary)', fontWeight:'700'}}>
                    <i className="fa-solid fa-boxes-stacked"></i><span>Inventaire</span>
                </Link>
                <Link className={`nav-item ${isActive('/admin/alerts')}`} to="/admin/alerts" style={{color:'var(--danger)', fontWeight:'700'}}>
                    <i className="fa-solid fa-bell"></i><span>Alertes</span>
                </Link>
            </>
        )}
      </nav>

      <div className="userbox">
        <div className="usertext">
          <div className="username">{user?.nom} {user?.prenom}</div>
          <div className="role">{user?.role}</div>
        </div>
        
        {/* Clic sur l'avatar mène au profil */}
        <div className="avatar" onClick={() => navigate('/profile')} style={{cursor:'pointer'}} title="Mon Profil">
            {user?.nom ? user.nom[0] : 'U'}
        </div>
        
        <button className="icon-btn" onClick={handleLogout} aria-label="Déconnexion">
            <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;