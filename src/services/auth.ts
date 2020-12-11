import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Container, Inject, Service } from 'typedi';
import config from '../config/public';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUserCreateResponseDTO, IUserInputDTO } from '../interfaces/IUser';
import { IUserLoginDTO } from './../interfaces/IUser';

@Service()
export default class AuthService {

    @Inject('UserModel') private userModel;
    @Inject('logger') private logger;
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface;

    constructor() {
    }

    public async SignUp(userDTO: IUserInputDTO): Promise<IUserCreateResponseDTO & { status?: number }> {
        try {
            const UserModel: Models.UserModel = Container.get('UserModel');

            const emailExists = await this.userModel.findOne({
                where: {
                    email: userDTO.email,
                }
            });

            if (emailExists) {
                return {
                    user: null,
                    status: 409
                };
            }

            const userRecord = await this.userModel.create({
                name: userDTO.name,
                email: userDTO.email,
                password: userDTO.password,
                roleId: userDTO.roleId
            });

            if (!userRecord) {
                throw new Error('User cannot be created');
            }
            // TODO: fix eventDispatcher
            // this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

            return {
                user: userRecord,
                status: 201
            };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    // TODO: figure out the promise generic
    public async SignIn(userLoginDTO: IUserLoginDTO): Promise<any> {
        try {
            const userRecord = await this.userModel.findOne({
                where: {
                    email: userLoginDTO.email
                }
            });

            if (!userRecord) {
                return {
                    user: userRecord,
                    token: null,
                    status: 404
                };
            }

            const validPassword = bcrypt.compareSync(userLoginDTO.password, userRecord.password);

            if (validPassword) {
                const token = this.generateJWT(userRecord);

                return {
                    status: 200,
                    user: userRecord,
                    token
                };
            }

            return {
                status: 400,
                token: null,
                user: null
            };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private generateJWT(user) {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 30);

        return jwt.sign({
                id: user.id,
                name: user.name,
                exp: expirationDate.getTime() / 1000
            },
            config.jwtSecret);
    }
}
