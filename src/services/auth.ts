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
                    access_token: null,
                    refresh_token: null,
                    status: 404
                };
            }

            const validPassword = bcrypt.compareSync(userLoginDTO.password, userRecord.password);

            if (validPassword) {
                const token = this.generateJWT(userRecord, 15);
                const refreshToken = this.generateRefreshToken(userRecord);

                return {
                    status: 200,
                    user: userRecord,
                    access_token: token,
                    refresh_token: refreshToken
                };
            }

            return {
                status: 400,
                access_token: null,
                refresh_token: null,
                user: null
            };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private generateRefreshToken(user) {
        // //get all user's refresh tokens from DB
        // const userRefreshTokens = mockDB.tokens.filter(token => token.userId === payload.id); // check if there are 5 or more refresh tokens,
        // // which have already been generated. In this case, we should
        // // remove all this refresh tokens and leave only new one for security reason
        // if (userRefreshTokens.length >= 5) {
        //     mockDB.tokens = mockDB.tokens.filter(token => token.userId !== payload.id);
        // } const refreshToken = jwt.sign({ user: payload }, jwtSecretString, { expiresIn: '30d' }); mockDB.tokens.push({
        //     id: uuidv1(),
        //     userId: payload.id,
        //     refreshToken
        // }); return refreshToken;

        // temp solution
        return this.generateJWT(user, 30);
    }

    private generateJWT(user, expiresIn) {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setTime(today.getTime() + expiresIn * 60000);
        return jwt.sign({
                id: user.id,
                name: user.name,
                exp: expirationDate.getTime() / 1000
            },
            config.jwtSecret);
    }
}
