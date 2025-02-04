const cron = require('node-cron');
const axios = require('axios');

cron.schedule('0 * * * *', async () => {
    try {
        const response = await axios.get('http://localhost:3000/check-new-tracks');
        console.log('Cron job выполнен: Подписки обновлены новыми треками.');
    } catch (error) {
        console.error('Ошибка при выполнении cron job:', error);
    }
});
