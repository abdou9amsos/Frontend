import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => { api.get('/users/me').then(res => setUser(res.data)); }, []);
    if(!user) return <div className="page-pad container">Chargement...</div>;

    return (
      <main className="page-pad">
        <div className="container">
          <section className="card profile">
            <div className="pf-left">
              <div className="pf-avatar">{user.nom[0]}</div>
              <div>
                <div className="pf-name">{user.nom} {user.prenom}</div>
                <div className="pf-role"><i className="fa-solid fa-shield-halved"></i> {user.role}</div>
                <div className="pf-meta"><span className="pill">{user.email}</span></div>
              </div>
            </div>
            <div className="pf-actions">
              <button className="btn btn-danger" onClick={()=>{localStorage.removeItem('access_token'); navigate('/login');}}>Déconnexion</button>
            </div>
          </section>
        </div>
      </main>
    );
};
export default Profile;