const User = require('../models/user.js');

class UserRepository {
    static async findAll() {
        return User.findAll();
    }

    static async findById(id) {
        return User.findByPk(id);
    }

    static async create(user) {
        return User.create(user);
    }

    static async update(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.password = updateData.password; 

        user.name = updateData.name;
        user.email = updateData.email;
        user.login = updateData.login;

        await user.save();
        return user;
    }

    static async delete(id) {
        return User.destroy({ where: { id } });
    }

    static async deleteById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
    }
}

module.exports = UserRepository;
