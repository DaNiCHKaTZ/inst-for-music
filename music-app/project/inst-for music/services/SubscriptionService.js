const SubscriptionRepository = require('../repositories/SubscriptionRepository.js');
const logDbOperation = require('../dbLogger.js');

class SubscriptionService {
    static async getAllSubscriptions(userId) {
        console.log('Fetching all subscriptions for user_id:', userId);
        if (isNaN(userId)) {
            throw new Error('user_id is not a valid number');
        }
        const whereClause = { user_id: userId };
        console.log('Constructed where clause:', whereClause);

        const subscriptions = await SubscriptionRepository.findAll(whereClause);
        await logDbOperation('read', 'subscriptions', userId);
        console.log('Fetched subscriptions:', subscriptions);
        return subscriptions;
    }

    static async getSubscriptionById(id) {
        console.log('Fetching subscription by id:', id);
        const subscription = await SubscriptionRepository.findById(id);
        await logDbOperation('read', 'subscriptions', id);
        console.log('Fetched subscription:', subscription);
        return subscription;
    }

    static async createSubscription(subscriptionData) {
        console.log('Creating subscription with data in service:', subscriptionData); 
        const newSubscription = await SubscriptionRepository.create(subscriptionData);
        await logDbOperation('create', 'subscriptions', newSubscription.id);
        console.log('Subscription created:', newSubscription);
        return newSubscription;
    }

    static async deleteSubscription(id) {
        console.log('Deleting subscription by id:', id);
        await SubscriptionRepository.delete(id);
        await logDbOperation('delete', 'subscriptions', id);
        console.log('Subscription deleted:', id);
    }
}

module.exports = SubscriptionService;
