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
                const [accessToken, refreshToken] = await Promise.all([this.signAccessToken(userRecord.id), this.signRefreshToken(userRecord.id)])

                return {
                    status: 200,
                    user: userRecord,
                    access_token: accessToken,
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

    public async RefreshToken(refreshToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.reIssueTokens(refreshToken));
            } catch(error) {
                reject(error);
            }
        })
    }

    private async reIssueTokens(refreshToken: string): Promise<any> {
        try {
            const decoded = jwt.verify(refreshToken, config.jwtSecret);
            const userId = decoded.aud;
            const [accessToken, refToken] = await Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])

            // reach to the UserToken table when you create it.
            // userToken =  userToken[0];
            // if(!userToken)
            //     throw {isError: true, message: 'User token does not exist'};
            // if(userToken.refreshToken !== refreshToken)
            //     throw {isError: true, message: 'Old token. Not valid anymore.'}


            return {
                access_token: accessToken,
                refresh_token: refToken
            };
        } catch (error) {
            throw error;
        }
    }

    private async signAccessToken(userId: number): Promise<any> {
        return this.signToken(userId, config.jwtSecret, '900000');
    }

    private async signRefreshToken(userId: number): Promise<any> {
        return this.signToken(userId, config.jwtSecret, '60d');
    }

    private async signToken(userId: number, secretKey: string, expiresIn: string): Promise<any> {
        const userRecord = await this.userModel.findByPk(userId);

        return new Promise((resolve, reject) => {

            const options = {
                expiresIn: expiresIn,
                issuer: userRecord.name,
                audience: userId.toString()
            };

            jwt.sign({}, secretKey, options, (err, token) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(token);
                }
            })
        })
    }
}
