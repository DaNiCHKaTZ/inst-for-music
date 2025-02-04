const UserRepository = require('../repositories/UserRepository.js');
const logDbOperation = require('../dbLogger.js');

class UserService {
    static async getAllUsers() {
        const users = await UserRepository.findAll();
        await logDbOperation('read', 'users', null);
        return users;
    }

    static async getUserById(id) {
        const user = await UserRepository.findById(id);
        await logDbOperation('read', 'users', id);
        return user;
    }

    static async createUser(user) {
        const newUser = await UserRepository.create(user);
        await logDbOperation('create', 'users', newUser.id);
        return newUser;
    }

    static async updateUser(id, updateData) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        updateData.password = user.password;

        const updatedUser = await UserRepository.update(id, updateData);
        await logDbOperation('update', 'users', id);
        return updatedUser;
    }

    static async deleteUser(id) {
        await UserRepository.delete(id);
        await logDbOperation('delete', 'users', id);
    }


    static async deleteUserById(id) {
        await UserRepository.deleteById(id);
        await logDbOperation('delete', 'users', id);
    }
}

module.exports = UserService;
