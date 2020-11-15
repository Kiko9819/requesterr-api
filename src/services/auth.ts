import jwt from 'jsonwebtoken';
import { Container, Inject, Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUserCreateResponseDTO, IUserInputDTO } from '../interfaces/IUser';
import config from '../config/public';

@Service()
export default class AuthService {

    @Inject('UserModel') private userModel;
    @Inject('logger') private logger;
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface;

    constructor() {
    }

    public async SignUp(userDTO: IUserInputDTO): Promise<IUserCreateResponseDTO> {
        try {
            const UserModel: Models.UserModel = Container.get('UserModel');

            // TODO: Add roles in the whole picture
            const userRecord = await this.userModel.create({
                name: userDTO.name,
                email: userDTO.email,
                password: userDTO.password
            });
            const token = this.generateJWT(userRecord);

            if (!userRecord) {
                throw new Error('User cannot be created');
            }
            // TODO: fix eventDispatcher
            // this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

            return {
                user: userRecord,
                token: token
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

        // TODO: Make super-secret more secure
        return jwt.sign({
                _id: user.id,
                name: user.name,
                exp: expirationDate.getTime() / 1000
            },
            config.jwtSecret);
    }
}
