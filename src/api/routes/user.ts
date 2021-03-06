import { NextFunction, Request, Response, Router } from 'express';
import Container from 'typedi';
import UsersService from '../../services/users';
import middlewares from '../middleware/public';

const route = Router();

export default (app: Router) => {

    app.use('/users', route);

    route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
        return res.json({
            user: req.currentUser
        }).status(200);
    });

    // update route
    route.patch("/:id", middlewares.isAuth, async(req: Request, res: Response, next: NextFunction) => {
        // find and update
        if(Number.isNaN(+req.params.id)) {
            return res.status(400).json({ message: "The provided id is not a valid id." });
        }

        try {
            const usersService = Container.get(UsersService);

            const {userRecord} = await usersService.UpdateUser(+req.params.id, req.body);

            if(!userRecord) {
                return res.status(404).json({ message: "User with that id doesn't exist." });
            }

            return res.status(200).json({ userRecord });
        } catch(error) {
            return next(error);
        }
    });
}
