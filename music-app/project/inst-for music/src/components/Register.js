import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../style.css'; 

function Register() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        email: '',
        name: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData, role: 'user' };
            await registerUser(dataToSubmit);
            setSuccess('Пользователь успешно зарегистрирован!');
            setError(null);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setError('Ошибка при регистрации. Попробуйте снова.');
            setSuccess(null);
        }
    };

    const handleBack = () => {
        navigate('/auth'); 
    };

    return (
        <div className="register-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Логин:</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Электронная почта:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
                <button type="button" onClick={handleBack}>Назад</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default Register;
