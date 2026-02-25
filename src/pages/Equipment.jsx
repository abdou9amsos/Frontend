import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Equipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obj, setObj] = useState(null);

  useEffect(() => { api.get(`/objets/${id}`).then(res => setObj(res.data)).catch(()=>alert('Introuvable')); }, [id]);

  const act = async (a) => { if(confirm('Sûr ?')) await api.post(`/objets/${id}/action?action=${a}`); };
  const reserve = async () => { await api.post(`/objets/${id}/reserve`); setObj({...obj, statut:'Occupé'}); };

  if(!obj) return <div className="page-pad container">Chargement...</div>;

  let statusClass = obj.statut === 'Disponible' ? 'chip-done' : (obj.statut === 'Occupé' ? 'chip-progress' : 'chip-offline');

  return (
    <main className="page-pad">
      <div className="container">
        <div className="eq-head">
          <button className="icon-btn" onClick={()=>navigate(-1)}><i className="fa-solid fa-arrow-left"></i></button>
          <div><h1 className="section-title">Détails</h1><p className="subtitle">Informations techniques.</p></div>
        </div>
        <section className="eq-layout">
          <div className="card eq-main">
            <div className="eq-top">
              <div className="eq-ico"><i className="fa-solid fa-cube"></i></div>
              <div className="eq-meta" style={{flex:1, marginLeft:'12px'}}>
                <div className="eq-type">{obj.type_objet.toUpperCase()}</div>
                <div className="eq-name">{obj.nom_marque} {obj.nom_model}</div>
                <div className="eq-loc"><i className="fa-solid fa-location-dot"></i> Salle {obj.id_salle}</div>
              </div>
              <span className={`chip ${statusClass}`}>{obj.statut}</span>
            </div>
            <div className="eq-grid">
              <div className="eq-box"><div className="eq-label">Modèle</div><div className="eq-value">{obj.nom_model}</div></div>
              <div className="eq-box"><div className="eq-label">MAC</div><div className="eq-value">{obj.mac_adresse||'-'}</div></div>
            </div>
          </div>
          <aside className="eq-side">
            <div className="card panel">
              <div className="panel-head"><h2><i className="fa-solid fa-gear"></i> Actions</h2></div>
              <div className="panel-body">
                {obj.statut === 'Disponible' && <button className="btn btn-primary" onClick={reserve}>Réserver</button>}
                <button className="btn" onClick={()=>act('reboot')}>Redémarrer</button>
                <button className="btn btn-danger" onClick={()=>{ const r=prompt('Raison:'); if(r) api.post(`/objets/${id}/report?description=${r}`); }}>Signaler</button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};
export default Equipment;