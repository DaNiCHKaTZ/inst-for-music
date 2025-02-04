import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserList from './UserList';
import TrackList from './TrackList';
import '../style.css';

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState(location.state?.view || 'users');

    useEffect(() => {
        if (location.state && location.state.view) {
            setView(location.state.view);
        }
    }, [location]);

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Добро пожаловать, Администратор!</h2>
            <div className="admin-dashboard-buttons">
                <button className="admin-dashboard-button" onClick={() => setView('users')}>Пользователи</button>
                <button className="admin-dashboard-button" onClick={() => setView('tracks')}>Треки</button>
            </div>
            <div className="admin-dashboard-content">
                {view === 'users' && <UserList setView={setView} />}
                {view === 'tracks' && <TrackList setView={setView} />}
            </div>
            <button className="admin-dashboard-logout-button" onClick={handleLogout}>Выход</button>
        </div>
    );
}

export default AdminDashboard;
