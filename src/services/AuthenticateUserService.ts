import { getRepository } from "typeorm";
import { compare } from 'bcryptjs';
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

import User from "../models/User.ts";

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where: { email }
        })

        if (!user) {
            throw new AppError('Incorrect email combination', 401);
        }

        // user.password = é a senha criptografada
        // password = senha não-criptografada

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched){
            throw new AppError('Incorrect email combination', 401);
        }

        const { expiresIn, secret } = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
          user,
          token,
        };
    }
}

export default AuthenticateUserService;