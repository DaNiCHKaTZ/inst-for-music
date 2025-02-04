const Subscription = require('../models/subscription.js');
const Track = require('../models/track.js');
const User = require('../models/user.js');  

class SubscriptionRepository {
    static findAll(where) {
        console.log('Finding all subscriptions with where clause:', JSON.stringify(where));
        return Subscription.findAll({
            where,
            include: [{
                model: Track,
                attributes: ['title', 'link'],
                include: [{
                    model: User,
                    attributes: ['id', 'name'] 
                }]
            }]
        });
    }

    static findById(id) {
        return Subscription.findByPk(id, {
            include: [{
                model: Track,
                attributes: ['title', 'link'],
                include: [{
                    model: User,
                    attributes: ['id', 'name'] 
                }]
            }]
        });
    }

    static create(subscriptionData) {
        console.log('Creating subscription with data in repository:', subscriptionData); 
        return Subscription.create(subscriptionData);
    }

    static delete(id) {
        return Subscription.destroy({ where: { id } });
    }
}

module.exports = SubscriptionRepository;
