import { useState, useEffect } from 'react';
import api from '../services/api';

const Inventory = () => {
  const [objets, setObjets] = useState([]);
  const [salles, setSalles] = useState([]); // <--- 1. État pour stocker les salles
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newItem, setNewItem] = useState({
      type_objet: 'Imprimante', 
      nom_marque: '',
      nom_model: '',
      id_salle: '', 
      mac_adresse: '',
      fonctionnalites: []
  });

  useEffect(() => {
    fetchObjets();
    fetchSalles(); // <--- 2. On charge les salles au démarrage
  }, []);

  const fetchObjets = () => {
      api.get('/search?q=')
         .then(res => setObjets(res.data))
         .catch(console.error)
         .finally(() => setLoading(false));
  };

  // <--- 3. Fonction pour récupérer les salles
  const fetchSalles = async () => {
      try {
          const res = await api.get('/salles');
          setSalles(res.data);
      } catch (err) {
          console.error("Erreur chargement salles", err);
      }
  };

  const handleInputChange = (e) => {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const payload = {
              ...newItem,
              id_salle: parseInt(newItem.id_salle, 10),
              mac_adresse: newItem.mac_adresse || `AUTO-${Date.now()}` 
          };

          const res = await api.post('/objets', payload);
          setObjets([...objets, res.data]);
          setShowModal(false);
          setNewItem({ type_objet: 'Imprimante', nom_marque: '', nom_model: '', id_salle: '', mac_adresse: '', fonctionnalites: [] });
          alert("Équipement ajouté avec succès !");
      } catch (err) {
          alert("Erreur ajout : " + (err.response?.data?.detail || err.message));
      }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("⚠️ Supprimer définitivement ?")) return;
      try {
          await api.delete(`/objets/${id}`);
          setObjets(objets.filter(o => o.id_objet !== id));
      } catch (err) { alert("Erreur suppression"); }
  };

  const getIcon = (t) => {
      if(t.toLowerCase().includes('imp')) return 'fa-print';
      if(t.toLowerCase().includes('proj')) return 'fa-video';
      return 'fa-cube';
  }

  return (
    <main className="page-pad">
      <div className="container">
        <div className="page-head" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div>
            <h1 className="section-title">Gestion de l'inventaire</h1>
            <p className="subtitle">Ajoutez, modifiez ou supprimez des équipements.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-plus"></i> Ajouter un équipement
          </button>
        </div>

        <div className="card" style={{overflow:'hidden'}}>
            <div style={{display:'grid', gridTemplateColumns:'50px 2fr 1.5fr 1fr 100px', padding:'16px', background:'var(--surface-2)', fontWeight:'700', color:'var(--muted)', fontSize:'13px', borderBottom:'1px solid var(--border)'}}>
                <div>Type</div>
                <div>Nom / Modèle</div>
                <div>Emplacement</div>
                <div>Statut</div>
                <div style={{textAlign:'right'}}>Actions</div>
            </div>

            {loading ? <div style={{padding:'20px', textAlign:'center'}}>Chargement...</div> : (
                <div style={{display:'flex', flexDirection:'column'}}>
                    {objets.map(obj => (
                        <div key={obj.id_objet} style={{display:'grid', gridTemplateColumns:'50px 2fr 1.5fr 1fr 100px', padding:'16px', alignItems:'center', borderBottom:'1px solid var(--border)'}}>
                            <div style={{color:'var(--primary)', fontSize:'18px'}}><i className={`fa-solid ${getIcon(obj.type_objet)}`}></i></div>
                            <div>
                                <div style={{fontWeight:'700'}}>{obj.nom_marque} {obj.nom_model}</div>
                                <div style={{fontSize:'12px', color:'var(--muted)'}}>MAC: {obj.mac_adresse}</div>
                            </div>
                            <div style={{fontSize:'14px', color:'var(--muted)'}}><i className="fa-solid fa-location-dot" style={{marginRight:'6px'}}></i> Salle {obj.id_salle}</div>
                            <div><span className={`chip ${obj.statut === 'Disponible' ? 'chip-done' : 'chip-busy'}`} style={{padding:'4px 8px', fontSize:'11px'}}>{obj.statut}</span></div>
                            <div style={{display:'flex', gap:'8px', justifyContent:'flex-end'}}>
                                <button className="icon-btn" style={{width:'34px', height:'34px'}} onClick={() => handleDelete(obj.id_objet)}><i className="fa-solid fa-trash" style={{color:'var(--danger)'}}></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* MODALE */}
        <div className={`modal-backdrop ${showModal ? 'open' : ''}`}>
            <div className="modal">
                <div className="modal-head">
                    <h3><i className="fa-solid fa-plus"></i> Nouvel équipement</h3>
                    <button className="icon-btn" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                        <div style={{display:'flex', gap:'12px'}}>
                            <div style={{flex:1}}>
                                <label className="subtitle" style={{fontSize:'12px', fontWeight:'700'}}>Type</label>
                                <select name="type_objet" className="input" value={newItem.type_objet} onChange={handleInputChange}>
                                    <option value="Imprimante">Imprimante</option>
                                    <option value="Projecteur">Projecteur</option>
                                    <option value="Scanner">Scanner</option>
                                    <option value="PC">PC</option>
                                </select>
                            </div>
                            <div style={{flex:1}}>
                                <label className="subtitle" style={{fontSize:'12px', fontWeight:'700'}}>Marque</label>
                                <input name="nom_marque" className="input" placeholder="Ex: Canon" required value={newItem.nom_marque} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div>
                            <label className="subtitle" style={{fontSize:'12px', fontWeight:'700'}}>Modèle</label>
                            <input name="nom_model" className="input" placeholder="Ex: Pixma 300" required value={newItem.nom_model} onChange={handleInputChange} />
                        </div>

                        {/* --- LE SELECT POUR LES SALLES --- */}
                        <div>
                            <label className="subtitle" style={{fontSize:'12px', fontWeight:'700'}}>Emplacement (Salle)</label>
                            <select 
                                name="id_salle" 
                                className="input" 
                                required 
                                value={newItem.id_salle} 
                                onChange={handleInputChange}
                            >
                                <option value="">-- Choisir une salle --</option>
                                {salles.length > 0 ? (
                                    salles.map(salle => (
                                        <option key={salle.id_salle} value={salle.id_salle}>
                                            {salle.nom_salle} (Étage {salle.num_etage})
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Aucune salle trouvée dans la base</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="subtitle" style={{fontSize:'12px', fontWeight:'700'}}>Adresse MAC</label>
                            <input name="mac_adresse" className="input" placeholder="00:1A:..." value={newItem.mac_adresse} onChange={handleInputChange} />
                        </div>
                    </div>
                    
                    <div className="modal-foot">
                        <button type="button" className="btn" onClick={() => setShowModal(false)} style={{marginRight:'10px'}}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Inventory;