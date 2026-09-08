import User from '../models/User.js';
class UserRepository {
    async createUser(userData) {
        return await User.create(userData);
    }
}

export default new UserRepository();