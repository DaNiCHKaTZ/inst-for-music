import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrackById, getLikes, getComments, createLike, deleteLike, createComment, getUserLike, deleteComment } from '../services/api';
import '../style.css';  

function TrackDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [track, setTrack] = useState({});
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [userLike, setUserLike] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [audioError, setAudioError] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        async function fetchTrackDetails() {
            try {
                const trackResponse = await getTrackById(Number(id));
                const trackData = trackResponse.data;

                if (trackData && trackData.link) {
                    trackData.link = trackData.link.replace('http://localhost:3001/', 'http://localhost:3000/');
                }
                console.log(trackData.link);
                setTrack(trackData || {});

                const likesResponse = await getLikes(Number(id));
                setLikes(likesResponse.data.length);

                const userId = Number(localStorage.getItem('user_id'));
                const userLikeResponse = await getUserLike(Number(id), userId);
                setUserLike(userLikeResponse.data || null);

                const commentsResponse = await getComments(Number(id));
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке деталей трека:', error);
            }
        }
        fetchTrackDetails();
    }, [id]);

    const handleLike = async () => {
        try {
            const userId = Number(localStorage.getItem('user_id'));
            if (userLike) {
                await deleteLike(userLike.id);
                setLikes(likes - 1);
                setUserLike(null);
            } else {
                const response = await createLike({ user_id: userId, track_id: Number(id) });
                setLikes(likes + 1);
                setUserLike(response.data);
            }
        } catch (error) {
            console.error('Ошибка при обработке лайка:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = Number(localStorage.getItem('user_id'));
            const response = await createComment({
                user_id: userId,
                track_id: Number(id),
                content: newComment,
                created_data: new Date().toISOString()
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Ошибка при добавлении комментария:', error);
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

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="track-details-container">
            <h2>{track.title}</h2>
            <p>Жанр: {track.genre}</p>
            {track.link ? (
                <div>
                    <audio ref={audioRef} controls src={track.link}>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
                <p>Ссылка недоступна</p>
            )}
            <div className="likes-container">
                <button onClick={handleLike}>{userLike ? 'Убрать лайк' : 'Лайк'}</button>
                <span>{likes} лайков</span>
            </div>
            <div className="comments-container">
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Оставить комментарий"
                        required
                    />
                    <button type="submit">Отправить</button>
                </form>
                <h3>Комментарии</h3>
                <ul>
                    {comments.map(comment => (
                        <li key={comment.id}>
                            <p><strong>{comment.user_name}</strong> ({new Date(comment.created_data).toLocaleString()})</p>
                            <p>{comment.content}</p>
                            {comment.user_id === Number(localStorage.getItem('user_id')) && (
                                <button onClick={() => handleDeleteComment(comment.id)}>Удалить</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <button type="button" className="back-button" onClick={handleBack}>Назад</button>
        </div>
    );
}

export default TrackDetails;
