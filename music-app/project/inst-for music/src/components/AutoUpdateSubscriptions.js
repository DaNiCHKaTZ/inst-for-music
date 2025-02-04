import React, { useEffect, useState } from 'react';
import { getSubscriptions, getTracksByUser, createSubscription } from '../services/api';

function AutoUpdateSubscriptions({ userId, setSubscriptions }) {
    const [subscriptions, setLocalSubscriptions] = useState([]);

    useEffect(() => {
        async function fetchSubscriptionsAndUpdate() {
            try {
            
                const responseSubscriptions = await getSubscriptions(userId);
                const userSubscriptions = responseSubscriptions.data;
                setLocalSubscriptions(userSubscriptions);
                setSubscriptions(userSubscriptions);

          
                const musicianIds = [...new Set(userSubscriptions.map(sub => sub.Track.User.id))];

             
                for (const musicianId of musicianIds) {
                    const responseTracks = await getTracksByUser(musicianId);
                    const musicianTracks = responseTracks.data;

                
                    const newTracks = musicianTracks.filter(track => !userSubscriptions.some(sub => sub.track_id === track.id));

                
                    for (const newTrack of newTracks) {
                        await createSubscription({ track_id: newTrack.id });
                    }
                }


                const updatedSubscriptions = await getSubscriptions(userId);
                setLocalSubscriptions(updatedSubscriptions.data);
                setSubscriptions(updatedSubscriptions.data);
            } catch (error) {
                console.error('Ошибка при обновлении подписок:', error);
            }
        }

        fetchSubscriptionsAndUpdate();
    }, [userId, setSubscriptions]);

    return null; 
}

export default AutoUpdateSubscriptions;
