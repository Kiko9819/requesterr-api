import { Sequelize } from 'sequelize/types';
import User from '../database/models/user';

export default async (sequelize: Sequelize) => {
    const UserModel = await User(sequelize);

    return {
        UserModel
    }
}
