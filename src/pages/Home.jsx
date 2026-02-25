import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.slice(0, 4))).catch(console.error);
  }, []);

  const handleSearch = () => { if(query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`); };
  const getIcon = (n) => {
      if(n.includes('imp')) return 'fa-print';
      if(n.includes('proj')) return 'fa-video';
      if(n.includes('scan')) return 'fa-qrcode';
      return 'fa-cube';
  };

  return (
    <main className="page-pad">
      <div className="container">
        <section className="hero">
          <h1 className="hero-title">Que cherchez-vous dans le bâtiment ?</h1>
          <p className="hero-sub">Recherchez un équipement, vérifiez sa disponibilité et accédez rapidement à sa fiche.</p>

          <div className="hero-search card">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input className="input" placeholder="Ex: Imprimante..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} />
            <button className="btn btn-primary" onClick={handleSearch}>Rechercher</button>
          </div>

          <div className="hero-recent">
            <span className="hero-recent-label"><i className="fa-regular fa-clock"></i> Recherches récentes</span>
            <button className="pill" onClick={()=>navigate('/search?q=Imprimante')}>Imprimante</button>
            <button className="pill" onClick={()=>navigate('/search?q=Scanner')}>Scanner</button>
          </div>
        </section>

        <section className="quick">
          <div className="quick-head">
            <h2 className="section-title">Accès rapide</h2>
            <Link className="quick-link" to="/categories">Voir tout</Link>
          </div>
          <div className="quick-grid">
            {categories.map((cat, i) => (
              <button key={i} className="quick-card card" onClick={()=>navigate(`/search?type=${cat.nom}`)}>
                <div className="quick-ico"><i className={`fa-solid ${getIcon(cat.nom.toLowerCase())}`}></i></div>
                <div className="quick-title">{cat.nom}</div>
                <div className="quick-sub">{cat.count} appareils</div>
              </button>
            ))}
          </div>
        </section>
        <footer className="footer"><div>SMARTFIND — PFE</div><div className="muted">© 2026</div></footer>
      </div>
    </main>
  );
};
export default Home;