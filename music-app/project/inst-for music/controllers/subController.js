const { getUsers, getSubscriptions, getTracksByUser, createSubscription } = require('../services/api');

async function getNewTracksAndSubscribe(req, res) {
    try {
        const users = await getUsers();
        for (const user of users) {
            const subscriptions = await getSubscriptions(user.id);
            for (const subscription of subscriptions) {
                const musicianId = subscription.musician_id;
                const responseTracks = await getTracksByUser(musicianId);
                const tracks = responseTracks.data;

                for (const track of tracks) {
                    if (!subscription.tracks.some(t => t.id === track.id)) {
                        await createSubscription({ user_id: user.id, track_id: track.id });
                    }
                }
            }
        }
        res.status(200).send('Подписки обновлены новыми треками.');
    } catch (error) {
        console.error('Ошибка при обновлении подписок новыми треками:', error);
        res.status(500).send('Ошибка при обновлении подписок новыми треками.');
    }
}

module.exports = {
    getNewTracksAndSubscribe,
};
