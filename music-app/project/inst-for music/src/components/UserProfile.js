import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, updateUser, getTracksByUser, deleteTrack, deleteUser } from '../services/api';
import '../style.css';  

function UserProfile() {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [tracks, setTracks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchUser = async () => {
        try {
            const userId = Number(localStorage.getItem('user_id'));
            const response = await getUserById(userId);
            setUser(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            setLogin(response.data.login);

            const tracksResponse = await getTracksByUser(userId);
            setTracks(tracksResponse.data);
        } catch (error) {
            console.error('Ошибка при загрузке пользователя:', error);
            setError('Ошибка при загрузке пользователя.');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const userId = Number(localStorage.getItem('user_id'));
            await updateUser(userId, { name, email, login, password: user.password, role: user.role });
            await fetchUser();
            setEditMode(false);
            setMessage('Информация о пользователе успешно обновлена.');
        } catch (error) {
            console.error('Ошибка при обновлении информации о пользователе:', error);
            setError('Ошибка при обновлении информации о пользователе.');
        }
    };

    const handleDeleteTrack = async (trackId) => {
        try {
            await deleteTrack(trackId);
            setTracks(tracks.filter(track => track.id !== trackId));
            setMessage('Трек успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении трека:', error);
            setError('Ошибка при удалении трека.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const userId = Number(localStorage.getItem('user_id'));
            await deleteUser(userId);
            localStorage.removeItem('user_id');
            localStorage.removeItem('token');
            window.location.href = '/auth';
        } catch (error) {
            console.error('Ошибка при удалении аккаунта:', error);
            setError('Ошибка при удалении аккаунта.');
        }
    };

    return (
        <div className="user-profile-container">
            <h2>Профиль пользователя</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {editMode ? (
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Имя: </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Отмена</button>
                </form>
            ) : (
                <div>
                    <p><strong>Логин:</strong> {user.login}</p>
                    <p><strong>Имя:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button type="button" onClick={() => setEditMode(true)}>Изменить</button>
                </div>
            )}
            <h3>Мои треки</h3>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        <Link to={`/tracks/${track.id}`}>{track.title}</Link>
                        <button className="delete-button" onClick={() => handleDeleteTrack(track.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <button className="delete-button" onClick={handleDeleteAccount}>Удалить аккаунт</button>
        </div>
    );
}

export default UserProfile;
