import UserRepository from '../repositories/user.repository.js';
class UserService {
    async createUser(userData) {
        return await UserRepository.createUser(userData);
    }
}

export default new UserService();