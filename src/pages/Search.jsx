import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(params.get('q')||'');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    let url = `/search?q=${encodeURIComponent(query)}`;
    if(params.get('type')) url += `&type=${encodeURIComponent(params.get('type'))}`;
    api.get(url).then(res => setResults(res.data));
  }, [params, query]);

  const search = () => setParams({ q: query });

  return (
    <main className="page-pad">
      <div className="container">
        <section className="search-top">
          <button className="icon-btn" onClick={()=>navigate(-1)}><i className="fa-solid fa-arrow-left"></i></button>
          <div className="searchbar card">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input className="input" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Rechercher..." />
            <button className="btn btn-primary" onClick={search}>Rechercher</button>
          </div>
        </section>
        <div className="found">{results.length} résultats</div>
        <section className="results">
          {results.map(r => (
              <article key={r.id_objet} className="card res" onClick={()=>navigate(`/equipment/${r.id_objet}`)}>
                <div className="res-left">
                  <div className="res-ico"><i className="fa-solid fa-cube"></i></div>
                  <div><div className="res-title">{r.nom_marque} {r.nom_model}</div><div className="res-sub">Salle {r.id_salle}</div></div>
                </div>
                <span className={`badge ${r.statut==='Disponible'?'ok':'busy'}`}>{r.statut}</span>
              </article>
          ))}
        </section>
      </div>
    </main>
  );
};
export default Search;