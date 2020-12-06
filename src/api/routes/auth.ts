import { IUserLoginDTO } from './../../interfaces/IUser';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { IUserInputDTO } from '../../interfaces/IUser';
import AuthService from '../../services/auth';

const route = Router();

export default (app: Router) => {
    app.use('/auth', route);

    route.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling Sign-Up endpoint with body: %o', req.body);

        try {
            const authService = Container.get(AuthService);
            const { user, status } = await authService.SignUp(req.body as IUserInputDTO);

            if (!user) {
                return res.status(status).json({ status: status, message: 'Email already exists' });
            }

            return res.status(status).json({ user });
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });

    route.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling Sign-In endpoint with body: %o', req.body);

        try {
            const authService = Container.get(AuthService);
            const { user, token, status } = await authService.SignIn(req.body as IUserLoginDTO);

            if (status === 400) {
                return res.status(status).json({ status: status, message: "Username or password is incorrect" });
            }

            if (status === 200) {
                return res.status(status).json({ status: status, message: "Successfully logged in", user: user, token: token });
            }

            return res.status(status).json({ status: status, message: "User doesn't exist" });

        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
}
