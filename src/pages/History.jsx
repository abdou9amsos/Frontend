import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/users/me/history'), api.get('/users/me/reservations')])
           .then(([h, r]) => { setHistory(h.data); setReservations(r.data); });
  }, []);

  return (
    <main className="page-pad">
      <div className="container">
        <div className="page-head"><div><h1 className="section-title">Activités</h1><p className="subtitle">Historique et réservations.</p></div></div>
        <section className="panel card">
          <div className="panel-head"><h2><i className="fa-solid fa-calendar-check"></i> Réservations</h2></div>
          <div className="panel-body">
              {reservations.map((r, i) => (
                  <div key={i} className="row" onClick={()=>navigate(`/equipment/${r.objet.id_objet}`)} style={{cursor:'pointer'}}>
                      <div className="row-left"><div className="ico"><i className="fa-solid fa-cube"></i></div><div><div className="title">{r.objet.nom_model}</div><div className="sub">{new Date(r.date_reservation).toLocaleDateString()}</div></div></div>
                      <span className={`chip ${r.statut_reservation==='Active'?'chip-done':'chip-offline'}`}>{r.statut_reservation}</span>
                  </div>
              ))}
          </div>
        </section>
        <section className="panel card mt">
          <div className="panel-head"><h2><i className="fa-solid fa-magnifying-glass"></i> Historique</h2></div>
          <div className="panel-body">
              {history.map((h, i) => (
                  <div key={i} className="row" onClick={()=>navigate(`/search?q=${h.requete_search}`)} style={{cursor:'pointer'}}>
                      <div className="row-left"><div style={{fontWeight:800, color:'var(--muted)'}}>#{i+1}</div><div className="title">{h.requete_search}</div></div>
                      <div className="right">{new Date(h.date_his).toLocaleDateString()}</div>
                  </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
};
export default History;