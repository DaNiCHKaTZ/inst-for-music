import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Subscriptions from './Subscriptions';
import Tracks from './Tracks';
import UserProfile from './UserProfile';
import AddTrack from './AddTrack';
import PlayerBar from './PlayerBar';
import { getSubscriptions } from '../services/api';
import '../style.css'; 

function Home() {
    const navigate = useNavigate();
    const [view, setView] = useState('subscriptions');
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);

    const handleLogout = () => {
        navigate('/auth');
    };

    const handleTrackSelect = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    const fetchSubscriptions = async () => {
        try {
            const userId = Number(localStorage.getItem('user_id'));
            const response = await getSubscriptions(userId);
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке подписок:', error);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [view]);

    return (
        <div className="home-container">
            <h1>Instagram for music</h1>
            <button className="logout-button" onClick={handleLogout}>Выход</button>
            <div className="view-buttons">
                <button 
                    onClick={() => setView('subscriptions')} 
                    className={view === 'subscriptions' ? 'active-view-button' : ''}
                >
                    Подписки
                </button>
                <button 
                    onClick={() => setView('tracks')} 
                    className={view === 'tracks' ? 'active-view-button' : ''}
                >
                    Музыканты
                </button>
                <button 
                    onClick={() => setView('userProfile')} 
                    className={view === 'userProfile' ? 'active-view-button' : ''}
                >
                    Пользователь
                </button>
                <button 
                    onClick={() => setView('addTrack')} 
                    className={view === 'addTrack' ? 'active-view-button' : ''}
                >
                    Добавить трек
                </button>
            </div>
            <div className="content-container">
                {view === 'subscriptions' && (
                    <Subscriptions 
                        handleTrackSelect={handleTrackSelect} 
                        isPlaying={isPlaying} 
                        setIsPlaying={setIsPlaying} 
                        playingTrackIndex={playingTrackIndex}
                        setPlayingTrackIndex={setPlayingTrackIndex}
                        subscriptions={subscriptions}
                        setSubscriptions={setSubscriptions} 
                    />
                )}
                {view === 'tracks' && (
                    <Tracks 
                        handleTrackSelect={handleTrackSelect}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        playingTrackIndex={playingTrackIndex}
                        setPlayingTrackIndex={setPlayingTrackIndex}
                        subscriptions={subscriptions}
                        setSubscriptions={setSubscriptions} 
                    />
                )}
                {view === 'userProfile' && <UserProfile />}
                {view === 'addTrack' && <AddTrack setView={setView} />}
            </div>
            <PlayerBar 
                currentTrackIndex={currentTrackIndex} 
                onTrackSelect={handleTrackSelect} 
                isPlaying={isPlaying} 
                setIsPlaying={setIsPlaying}
                setPlayingTrackIndex={setPlayingTrackIndex}
                subscriptions={subscriptions}
            />
        </div>
    );
}

export default Home;
