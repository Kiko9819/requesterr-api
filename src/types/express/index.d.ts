import {Model} from 'sequelize';
import { IUser } from '../../interfaces/IUser';

declare global {
    namespace Express {
        export interface Request {
            currentUser: IUser
        }
    }

    namespace Models {
        export type UserModel = Model<IUser>;
    }
}
