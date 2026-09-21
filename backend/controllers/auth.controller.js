import AuthService from "../services/auth.service.js";

class AuthController {

    async SignUp(request, response, next) {
        try {
            const result = await AuthService.SignUp(request.body);
            response.status(201).json(result);
        } catch(error) {
            next(error);
        }
    }

    async SignIn(request, response, next) {
        try {
            const result = await AuthService.SignIn(request.body);
            response.status(200).json(result);
        } catch(error) {
            next(error);
        }
    }

    async Profile(request, response, next) {
        try {
            response.status(200).json({ user: request.user });
        } catch(error) {
            next(error);
        }
    }
}

export default new AuthController();