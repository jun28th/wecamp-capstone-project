import AuthService from "../services/auth.service.js";

class AuthController {

    async SignUp(request, response) {
        try {
            const result = await AuthService.SignUp(request.body);
            console.log("hellooooo");
            response.status(201).json(result);
        } catch(error) {
            response.status(400).json({ error: error.message });
        }
    }

    async SignIn(request, response) {
        try {
            const result = await AuthService.SignIn(request.body);
            response.status(200).json(result);
        } catch(error) {
            response.status(400).json({ error: error.message });
        }
    }

    async Profile(request, response) {
        try {
            response.status(200).json({ user: request.user });
        } catch(error) {
            response.status(500).json({ error: error.message });
        }
    }
}

export default new AuthController();