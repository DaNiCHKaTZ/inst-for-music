import React, { useState, useRef, useEffect } from 'react';
import '../style.css';

function PlayerBar({ currentTrackIndex, onTrackSelect, isPlaying, setIsPlaying, setPlayingTrackIndex, subscriptions }) {
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const savedTrackIndex = Number(localStorage.getItem('currentTrackIndex'));
        const savedTime = Number(localStorage.getItem('currentTime'));

        if (savedTrackIndex !== null && !isNaN(savedTrackIndex)) {
            onTrackSelect(savedTrackIndex);
            setPlayingTrackIndex(savedTrackIndex);
        }

        if (audioRef.current && !isNaN(savedTime)) {
            audioRef.current.currentTime = savedTime;
        }

        setIsPlaying(false);
    }, []);

    useEffect(() => {
        if (subscriptions.length > 0 && audioRef.current && currentTrackIndex !== null) {
            const audioSource = subscriptions[currentTrackIndex]?.Track.link.replace('http://localhost:3001/', 'http://localhost:3000/');
            if (audioRef.current.src !== audioSource) {
                audioRef.current.src = audioSource;
                audioRef.current.pause();
                setProgress(0);
            }
            if (isPlaying) {
                audioRef.current.play().then(() => {
                    setPlayingTrackIndex(currentTrackIndex);
                }).catch(error => {
                    console.error('Ошибка при воспроизведении:', error);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentTrackIndex, subscriptions, isPlaying]);

    useEffect(() => {
        localStorage.setItem('currentTrackIndex', currentTrackIndex);
        localStorage.setItem('currentTime', audioRef.current ? audioRef.current.currentTime : 0);
    }, [currentTrackIndex, progress]);

    const handlePlayPause = () => {
        if (!isPlaying) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setPlayingTrackIndex(currentTrackIndex);
            }).catch(error => {
                console.error('Ошибка при воспроизведении:', error);
            });
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleNextTrack = () => {
        if (currentTrackIndex < subscriptions.length - 1) {
            onTrackSelect(currentTrackIndex + 1);
        } else {
            onTrackSelect(0);
        }
        setIsPlaying(true);
    };

    const handlePrevTrack = () => {
        if (currentTrackIndex > 0) {
            onTrackSelect(currentTrackIndex - 1);
        } else {
            onTrackSelect(subscriptions.length - 1);
        }
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(newProgress);
        }
    };

    const handleSeek = (event) => {
        const newTime = (event.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(event.target.value);
    };

    const handleEnded = () => {
        handleNextTrack();
        setIsPlaying(true);
    };

    return (
        <div className="player-bar">
            {subscriptions.length > 0 && (
                <>
                    <button className="control-button" onClick={handlePrevTrack}>Назад</button>
                    <button className="control-button" onClick={handlePlayPause}>
                        {isPlaying ? 'Пауза' : 'Воспроизвести'}
                    </button>
                    <button className="control-button" onClick={handleNextTrack}>Вперед</button>
                    <span className="track-title">{subscriptions[currentTrackIndex]?.Track?.title || 'Нет доступных треков'}</span>
                    <input
                        type="range"
                        id="progress-bar"
                        className="progress-bar"
                        value={progress}
                        onChange={handleSeek}
                    />
                </>
            )}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                controls
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default PlayerBar;
