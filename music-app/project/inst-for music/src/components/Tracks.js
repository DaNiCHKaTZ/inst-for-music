import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createSubscription, getSubscriptions, getTracksByUser, deleteSubscription } from '../services/api';
import '../style.css';

function Tracks({ handleTrackSelect, isPlaying, setIsPlaying, playingTrackIndex, setPlayingTrackIndex, setSubscriptions, subscriptions }) {
    const [musicians, setMusicians] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMusiciansAndSubscriptions() {
            try {
                const responseUsers = await getUsers();
                const users = responseUsers.data;

                const musiciansWithTracks = await Promise.all(users.map(async (user) => {
                    const responseTracks = await getTracksByUser(user.id);
                    const tracks = responseTracks.data;
                    return { ...user, tracks };
                }));

                const musicians = musiciansWithTracks.filter(musician => musician.tracks.length > 0);
                setMusicians(musicians);

                const userId = Number(localStorage.getItem('user_id'));
                const responseSubscriptions = await getSubscriptions(userId);
                setSubscriptions(responseSubscriptions.data);
                console.log('Подписки загружены:', responseSubscriptions.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных.');
            }
        }
        fetchMusiciansAndSubscriptions();
    }, [setSubscriptions]);

    const handleSubscribeToMusician = async (musicianId) => {
        try {
            const responseTracks = await getTracksByUser(musicianId);
            const tracks = responseTracks.data;

            for (const track of tracks) {
                await createSubscription({ track_id: track.id });
            }
            setMessage(`Подписка на музыканта успешно оформлена!`);

            const userId = Number(localStorage.getItem('user_id'));
            const responseSubscriptions = await getSubscriptions(userId);
            setSubscriptions(responseSubscriptions.data);
            console.log('Подписки после подписки:', responseSubscriptions.data);
        } catch (error) {
            console.error('Ошибка при создании подписки на музыканта:', error);
            setError('Ошибка при создании подписки на музыканта.');
        }
    };

    const handleUnsubscribeFromMusician = async (musicianId) => {
        try {
            const responseTracks = await getTracksByUser(musicianId);
            const tracks = responseTracks.data;
            const trackIds = tracks.map(track => track.id);

            for (const subscription of subscriptions) {
                if (trackIds.includes(subscription.track_id)) {
                    await deleteSubscription(subscription.id);
                }
            }

            const userId = Number(localStorage.getItem('user_id'));
            const responseSubscriptions = await getSubscriptions(userId);
            setSubscriptions(responseSubscriptions.data);
            setMessage(`Отписка от музыканта успешно выполнена.`);
            console.log('Подписки после отписки:', responseSubscriptions.data);
        } catch (error) {
            console.error('Ошибка при отписке от музыканта:', error);
            setError('Ошибка при отписке от музыканта.');
        }
    };

    const isSubscribedToMusician = (musicianId) => {
        console.log(`Проверка подписки на музыканта ${musicianId}:`, subscriptions);
        return subscriptions.some(subscription => {
            console.log(`subscription.Track:`, subscription.Track);
            return subscription.Track && subscription.Track.User && subscription.Track.User.id === musicianId;
        });
    };

    const handleMusicianClick = (musicianId) => {
        navigate(`/musician/${musicianId}`);
    };

    return (
        <div className="tracks-container">
            <h2>Музыканты</h2>
            <ul className="tracks-list">
                {musicians.map(musician => (
                    <li key={musician.id} className="track-item" onClick={() => handleMusicianClick(musician.id)}>
                        <span className="track-title">{musician.name}</span>
                        <div className="track-controls">
                            {isSubscribedToMusician(musician.id) ? (
                                <>
                                    <button className="unsubscribe-button" onClick={(e) => { e.stopPropagation(); handleUnsubscribeFromMusician(musician.id); }}>Отписаться</button>
                                </>
                            ) : (
                                <button className="subscribe-button" onClick={(e) => { e.stopPropagation(); handleSubscribeToMusician(musician.id); }}>Подписаться на музыканта</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
}

export default Tracks;
