import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";

const SALT_ROUNDS = 10;

class AuthService {
    async SignUp(data) {
        const { email, fullName, password } = data;

        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError("Email already registered", 409);
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await UserRepository.createUser({
            email,
            displayName: fullName,
            passwordHash,
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, fullName: user.displayName },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.displayName,
            },
        };
    }

    async SignIn(data) {
        const { email, password } = data;

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, fullName: user.displayName },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.displayName,
            },
        };
    }
}

export default new AuthService();