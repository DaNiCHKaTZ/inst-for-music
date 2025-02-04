import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrackById, getComments, getLikes, deleteTrack, deleteComment } from '../services/api';
import '../style.css';

function TrackPage() {
    const { trackId } = useParams();
    const navigate = useNavigate();
    const [track, setTrack] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchTrackDetails = async () => {
            try {
                const trackResponse = await getTrackById(trackId);
                setTrack(trackResponse.data);

                const commentResponse = await getComments(trackId);
                setComments(commentResponse.data);

                const likesResponse = await getLikes(trackId);
                setLikes(likesResponse.data.length);
            } catch (error) {
                console.error('Ошибка при загрузке данных трека:', error);
            }
        };

        fetchTrackDetails();
    }, [trackId]);

    const handleDeleteTrack = async () => {
        try {
            await deleteTrack(trackId);
            navigate('/admin-dashboard', { state: { view: 'tracks' } }); 
        } catch (error) {
            console.error('Ошибка при удалении трека:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error);
        }
    };

    return (
        <div className="track-page-container">
            {track ? (
                <div>
                    <h4>Информация о треке</h4>
                    <p>Название: {track.title}</p>
                    <p>Исполнитель: {track.artist}</p>
                    <p>Количество лайков: {likes}</p>

                    <h4>Комментарии</h4>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                <strong>{comment.user_name}:</strong> {comment.content}
                                <div className="comment-button-container">
                                    <button onClick={() => handleDeleteComment(comment.id)}>Удалить комментарий</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="track-page-buttons">
                        <button onClick={() => navigate('/admin-dashboard', { state: { view: 'tracks' } })}>Назад</button>
                        <button onClick={handleDeleteTrack}>Удалить трек</button>
                    </div>
                </div>
            ) : (
                <p>Загрузка данных...</p>
            )}
        </div>
    );
}

export default TrackPage;
