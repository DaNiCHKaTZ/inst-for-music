import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMusicians, createSubscription, deleteSubscription } from '../services/api';
import '../style.css';  

function Musicians({ handleTrackSelect, isPlaying, setIsPlaying, playingTrackIndex, setPlayingTrackIndex, setSubscriptions, subscriptions }) {
    const [musicians, setMusicians] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMusiciansAndSubscriptions() {
            try {
                const responseMusicians = await getMusicians();
                setMusicians(responseMusicians.data);

                const userId = Number(localStorage.getItem('user_id'));
                const responseSubscriptions = await getSubscriptions(userId);
                setSubscriptions(responseSubscriptions.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных.');
            }
        }
        fetchMusiciansAndSubscriptions();
    }, [setSubscriptions]);

    const handleSubscribe = async (musicianId) => {
        try {
            await createSubscription({ musician_id: musicianId });
            setMessage(`Подписка на музыканта ${musicianId} успешно оформлена!`);
            const userId = Number(localStorage.getItem('user_id'));
            const responseSubscriptions = await getSubscriptions(userId);
            setSubscriptions(responseSubscriptions.data);
        } catch (error) {
            console.error('Ошибка при создании подписки:', error);
            setError('Ошибка при создании подписки.');
        }
    };

    const handleUnsubscribe = async (subscriptionId) => {
        try {
            await deleteSubscription(subscriptionId);
            const updatedSubscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId);
            setSubscriptions(updatedSubscriptions);
            setMessage('Отписка успешно выполнена.');

            if (playingTrackIndex !== null && subscriptions[playingTrackIndex].id === subscriptionId) {
                setPlayingTrackIndex(null);
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Ошибка при отписке:', error);
            setError('Ошибка при отписке.');
        }
    };

    const isSubscribed = (musicianId) => {
        return subscriptions.some(subscription => subscription.musician_id === musicianId);
    };

    const handleMusicianClick = (musicianId) => {
        navigate(`/musicians/${musicianId}`);
    };

    return (
        <div className="musicians-container">
            <h2>Музыканты</h2>
            <ul className="musicians-list">
                {musicians.map(musician => (
                    <li key={musician.id} className="musician-item">
                        <span onClick={() => handleMusicianClick(musician.id)} className="musician-name">
                            {musician.name}
                        </span>
                        {isSubscribed(musician.id) ? (
                            <button 
                                className="unsubscribe-button" 
                                onClick={() => handleUnsubscribe(subscriptions.find(sub => sub.musician_id === musician.id).id)}
                            >
                                Отписаться
                            </button>
                        ) : (
                            <button 
                                className="subscribe-button" 
                                onClick={() => handleSubscribe(musician.id)}
                            >
                                Подписаться
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
}

export default Musicians;
