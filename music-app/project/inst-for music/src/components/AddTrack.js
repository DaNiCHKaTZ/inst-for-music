import React, { useState } from 'react';
import { createTrack, uploadFile } from '../services/api';
import '../style.css';  

function AddTrack({ setView }) {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const handleAddTrack = async (e) => {
        e.preventDefault();
        try {
            let filePath = '';
            if (file) {
                const uploadResponse = await uploadFile(file);
                filePath = uploadResponse.data.filePath;
            }
            const userId = Number(localStorage.getItem('user_id'));
            const trackData = { title, genre, link: filePath, musician_id: userId };
            await createTrack(trackData);
            setView('tracks');
        } catch (error) {
            console.error('Ошибка при добавлении трека:', error);
            setError('Ошибка при добавлении трека.');
        }
    };

    const genres = [
        'Rock',
        'Pop',
        'Hip-Hop',
        'Jazz',
        'Classical',
        'Electronic',
        'Country',
        'Phonk'
    ];

    return (
        <div className="add-track-container">
            <h2>Добавить новый трек</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleAddTrack}>
                <div>
                    <label>Название: </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Жанр: </label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="" disabled>Выберите жанр</option>
                        {genres.map((g, index) => (
                            <option key={index} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Файл: </label>
                    <label className="custom-file-upload">
                        <input type="file" accept="audio/*" onChange={handleFileChange} required />
                        Выбрать файл
                    </label>
                    {fileName && <p className="file-name">{fileName}</p>}
                </div>
                <button type="submit">Добавить трек</button>
            </form>
        </div>
    );
}

export default AddTrack;
