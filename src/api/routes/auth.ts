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

            if(!user) {
                return res.status(status).json({status: status, message: 'Email already exists'});
            }

            return res.status(status).json({ user });
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });

    route.post('/signin', (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json({ user: 'user DTO', token: 'probably token' });
    });

    route.post('/logout', (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).end();
    });
}
