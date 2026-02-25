import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { api.get('/categories').then(res => setCategories(res.data)); }, []);

  const getIcon = (n) => {
    if(n.includes('imprimante')) return 'fa-print';
    if(n.includes('proj')) return 'fa-video';
    if(n.includes('scan')) return 'fa-qrcode';
    return 'fa-cube';
  };

  return (
    <main className="page-pad">
      <div className="container">
        <div className="page-head">
          <div><h1 className="section-title">Catalogue</h1><p className="subtitle">Par catégorie.</p></div>
        </div>
        <section className="grid">
          {categories.map((cat, i) => (
            <article key={i} className="card cat" onClick={()=>navigate(`/search?type=${cat.nom}`)}>
              <div className="cat-ico"><i className={`fa-solid ${getIcon(cat.nom.toLowerCase())}`}></i></div>
              <div className="cat-title">{cat.nom}</div>
              <div className="cat-count">{cat.count} appareils</div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};
export default Categories;