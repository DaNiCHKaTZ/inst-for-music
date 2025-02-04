import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/api';
import '../style.css';

function UserList({ setView }) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        navigate(`/user/${user.id}`);
    };

    return (
        <div className="user-list-container">
            <h3>Список пользователей</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id} onClick={() => {
                        handleUserClick(user);
                        setView('users');
                    }}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
