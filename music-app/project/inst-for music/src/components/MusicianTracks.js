import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTracksByUser } from '../services/api';
import '../style.css';

function MusicianTracks() {
    const { musicianId } = useParams();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [musician, setMusician] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTracks() {
            try {
                const response = await getTracksByUser(musicianId);
                setTracks(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке треков:', error);
                setError('Ошибка при загрузке треков.');
            }
        }
        fetchTracks();
    }, [musicianId]);

    const handleTrackClick = (trackId) => {
        navigate(`/tracks/${trackId}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="musicianstracks-container">
            <div className="musicianstracks-square">
                <h2>Треки музыканта</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ul className="musicianstracks-list">
                    {tracks.map(track => (
                        <li key={track.id} className="musicianstracks-item" onClick={() => handleTrackClick(track.id)}>
                            <span className="musicianstracks-title">{track.title}</span>
                        </li>
                    ))}
                </ul>
                <button className="musicianstracks-back-button" onClick={handleBackClick}>Назад</button>
            </div>
        </div>
    );
}

export default MusicianTracks;
