import { Request, Response, Router } from 'express';
import middlewares from '../middleware/public';

const route = Router();

export default (app: Router) => {

    app.use('/users', route);

    route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
        console.log(req.currentUser);
        return res.json({
            user: req.currentUser
        }).status(200);
    })
}
