import UserService from "../services/user.service.js";

class UserController {
    async createUser(req, res){
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();