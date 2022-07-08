import { getRepository } from "typeorm";
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import AppError from "../errors/AppError";

import User from "../models/User.ts";

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: Request): Promise<User>{
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError('Apenas usuários logados podem alterar o avatar.', 401)
        }

        if (user.avatar) {
            // deletar avatar anterior

            // essa variavel vai buscar o caminho da arquivo
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            // essa variavel vai trazer o status do arquivo, se existir
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            // se o arquivo existe, ele vai ser deletado
            if (userAvatarFilePath) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;