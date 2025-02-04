import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getUserById, getSubscriptions, getCommentsByUser, deleteUserById, deleteComment } from '../services/api';
import '../style.css'; 

function UserPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userResponse = await getUserById(userId);
                setUser(userResponse.data);

                const subscriptionResponse = await getSubscriptions(userId);
                const subscriptionsWithMusicians = subscriptionResponse.data.map(subscription => {
                    return {
                        ...subscription,
                        musician: subscription.Track.User
                    };
                });
                setSubscriptions(subscriptionsWithMusicians);

                const commentResponse = await getCommentsByUser(userId);
                setComments(commentResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleDeleteUser = async () => {
        try {
            await deleteUserById(userId);
            navigate('/admin-dashboard', { state: { view: 'users' } });
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
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
        <div className="user-page-container">
            {user && (
                <div>
                    <h4>Информация о пользователе</h4>
                    <p>Имя: {user.name}</p>
                    <p>Email: {user.email}</p>

                    <h4>Подписки</h4>
                    <ul>
                        {subscriptions.map(subscription => (
                            <li key={subscription.id}>
                                {subscription.musician ? subscription.musician.name : 'Неизвестный музыкант'}
                            </li>
                        ))}
                    </ul>

                    <h4>Комментарии</h4>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                <p>{comment.content}</p>
                                <p>Трек: {comment.Track ? comment.Track.title : 'Нет данных о треке'}</p>
                                <button onClick={() => handleDeleteComment(comment.id)}>Удалить комментарий</button>
                            </li>
                        ))}
                    </ul>

                    <div className="user-page-buttons">
                        <button onClick={() => navigate('/admin-dashboard', { state: { view: 'users' } })}>Назад</button>
                        <button onClick={handleDeleteUser}>Удалить пользователя</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserPage;
