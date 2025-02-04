import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../style.css';

function Login() {
    const [credentials, setCredentials] = useState({ login: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            console.log('Login response:', response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user.id);
            localStorage.setItem('role', response.data.user.role);
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setError('Ошибка при входе. Попробуйте снова.');
        }
    };

    const handleBack = () => {
        navigate('/auth');
    };

    return (
        <div className="login-container">
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Логин:</label>
                    <input type="text" name="login" value={credentials.login} onChange={handleChange} placeholder="Логин" required />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Пароль" required />
                </div>
                <button type="submit">Войти</button>
                <button type="button" onClick={handleBack}>Назад</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
