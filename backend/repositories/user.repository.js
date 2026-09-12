import { User } from "../models/index.js";

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async updateUser(id, updates) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updates);
  }

  async deleteUser(id) {
    return await User.destroy({ where: { id } });
  }
}

export default new UserRepository();
