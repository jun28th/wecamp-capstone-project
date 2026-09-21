import UserService from "../services/user.service.js";

class UserController {
    async createUser(req, res, next) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();