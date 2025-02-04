import React, { useState, useEffect } from 'react';
import { getSubscriptions, deleteSubscription } from '../services/api';
import { Link } from 'react-router-dom';
import '../Subscriptions.css'; 

function Subscriptions({ handleTrackSelect, isPlaying, setIsPlaying, playingTrackIndex, setPlayingTrackIndex, setSubscriptions }) {
    const [localSubscriptions, setLocalSubscriptions] = useState([]);

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                const userId = Number(localStorage.getItem('user_id'));
                console.log('Fetching subscriptions for user_id:', userId);
                const response = await getSubscriptions(userId);
                console.log('Fetch subscriptions response:', response);
                setLocalSubscriptions(response.data);
                setSubscriptions(response.data); 
            } catch (error) {
                console.error('Ошибка при загрузке подписок:', error);
            }
        }
        fetchSubscriptions();
    }, [setSubscriptions]);

    const handleUnsubscribe = async (subscriptionId) => {
        try {
            await deleteSubscription(subscriptionId);
            const updatedSubscriptions = localSubscriptions.filter(subscription => subscription.id !== subscriptionId);
            setLocalSubscriptions(updatedSubscriptions);
            setSubscriptions(updatedSubscriptions);
            console.log('Updated subscriptions after unsubscribe:', updatedSubscriptions);

            if (playingTrackIndex !== null && localSubscriptions[playingTrackIndex].id === subscriptionId) {
                setPlayingTrackIndex(null);
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Ошибка при отписке:', error);
        }
    };

    const handlePlayPause = (index) => {
        if (playingTrackIndex === index) {
            setPlayingTrackIndex(null);
            setIsPlaying(false);
        } else {
            setPlayingTrackIndex(index);
            handleTrackSelect(index);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (!isPlaying) {
            setPlayingTrackIndex(null); 
        }
    }, [isPlaying]);

    return (
        <div className="subscriptions-container">
            <h2>Подписки</h2>
            <ul className="subscriptions-list">
                {localSubscriptions.map((subscription, index) => (
                    <li key={subscription.id} className="subscription-item">
                        <Link to={`/tracks/${subscription.track_id}`} className="subscription-title">
                            {subscription.Track.title} <br /> <span className="musician-name">Исполнитель: {subscription.Track.User.name}</span>
                        </Link>
                        <button
                            className={`play-button ${playingTrackIndex === index ? 'playing' : ''}`}
                            onClick={() => handlePlayPause(index)}
                        >
                            {playingTrackIndex === index && isPlaying ? '⏸️' : '▶️'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Subscriptions;
