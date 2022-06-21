import { getRepository } from "typeorm";

import User from "../models/User.ts";
import {hash} from "bcryptjs";

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const UserRepository = getRepository(User);

        const CheckUseExists = await UserRepository.findOne({
            where: { email },
        })

        if (CheckUseExists) {
            throw new Error('Email Address already used.');
        }

        const hashedPassword = await hash(password, 8);

        const user = UserRepository.create({
            name,
            email,
            password: hashedPassword,
        })

        await UserRepository.save(user);

        return user;
    }
}

export default CreateUserService;