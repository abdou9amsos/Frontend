import { useState, useEffect } from 'react';
import api from '../services/api';

const Admin = () => {
  const [alertes, setAlertes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/alertes').then(res => setAlertes(res.data))
       .catch(err => setError(err.response?.status === 403 ? "Accès interdit." : "Erreur."));
  }, []);

  const resolve = async (id) => {
      if(!confirm("Résoudre ?")) return;
      await api.put(`/admin/alertes/${id}/resolve`, { nouveau_statut_objet: "Disponible" });
      setAlertes(alertes.filter(a => a.id_alerte !== id));
  };

  return (
    <main className="page-pad">
      <div className="container">
        <section className="card admin">
          <h1 className="section-title">Administration</h1>
          <p className="subtitle">Gestion des incidents et alertes signalées.</p>

          <div className="tags">
            <span className="pill" style={{color:'var(--primary)', borderColor:'var(--primary)'}}><i className="fa-solid fa-bell"></i> {alertes.length} Alertes</span>
            <span className="pill"><i className="fa-solid fa-users"></i> Utilisateurs</span>
          </div>

          <div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'12px'}}>
              {error && <div className="chip chip-busy">{error}</div>}
              {alertes.length === 0 && !error && <div className="chip chip-done">Aucune alerte.</div>}
              
              {alertes.map(a => (
                  <div key={a.id_alerte} className="row">
                      <div className="row-left">
                          <div className="ico" style={{background:'#fef3f2', color:'var(--danger)'}}><i className="fa-solid fa-triangle-exclamation"></i></div>
                          <div>
                              <div className="title">{a.message}</div>
                              <div className="sub">{a.nom_objet} • {new Date(a.date_alerte).toLocaleDateString()}</div>
                          </div>
                      </div>
                      <button className="btn" onClick={()=>resolve(a.id_alerte)}>Résoudre</button>
                  </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
};
export default Admin;