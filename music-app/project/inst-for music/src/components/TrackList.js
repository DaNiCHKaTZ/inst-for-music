import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTracks } from '../services/api';
import '../style.css';

function TrackList({ setView }) {
    const [tracks, setTracks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await getTracks();
                setTracks(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке треков:', error);
            }
        };

        fetchTracks();
    }, []);

    const handleTrackClick = (track) => {
        navigate(`/track/${track.id}`);
        setView('tracks');
    };

    return (
        <div className="track-list-container">
            <h3>Список треков</h3>
            <ul>
                {tracks.map(track => (
                    <li key={track.id} onClick={() => handleTrackClick(track)}>
                        {track.title} {track.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrackList;
