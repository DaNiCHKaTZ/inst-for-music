import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AuthChoice from './components/AuthForm';
import Login from './components/Login';
import Register from './components/Register';
import Tracks from './components/Tracks';
import TrackDetails from './components/TrackDetails';
import AdminDashboard from './components/AdminDashboard'; 
import UserPage from './components/UserPage'; 
import TrackPage from './components/TrackPage'; 
import MusicianTracks from './components/MusicianTracks';
import AutoUpdateSubscriptions from './components/AutoUpdateSubscriptions';

function App() {
    const [subscriptions, setSubscriptions] = useState([]);
    const userId = Number(localStorage.getItem('user_id'));

    return (
        <Router>
            <div className="App">
                {userId && <AutoUpdateSubscriptions userId={userId} setSubscriptions={setSubscriptions} />}
                
                <Routes>
                    <Route path="/" element={<AuthChoice />} />
                    <Route path="/auth" element={<AuthChoice />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/tracks" element={<Tracks />} />
                    <Route path="/tracks/:id" element={<TrackDetails />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/user/:userId" element={<UserPage />} />
                    <Route path="/track/:trackId" element={<TrackPage />} /> 
                    <Route path="/musician/:musicianId" element={<MusicianTracks />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
