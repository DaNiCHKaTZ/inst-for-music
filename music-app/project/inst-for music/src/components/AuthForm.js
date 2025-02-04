import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';  

function AuthChoice() {
    const navigate = useNavigate();

    return (
        <div className="auth-choice-container">
            <h2 className="auth-choice-title">Добро пожаловать! Пожалуйста, выберите опцию:</h2>
            <form className="auth-choice-form">
                <button className="auth-choice-button" onClick={() => navigate('/login')}>Авторизация</button>
                <button className="auth-choice-button" onClick={() => navigate('/register')}>Регистрация</button>
            </form>
        </div>
    );
}

export default AuthChoice;
