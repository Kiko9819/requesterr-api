import { NextFunction, Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
    app.use('/auth', route);

    route.post('/signup', (req: Request, res: Response, next: NextFunction) => {
        return res.status(201).json({user: 'user DTO', token: 'probably token'})
    });

    route.post('/signin', (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json({user: 'user DTO', token: 'probably token'})
    })

    route.post('/logout', (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).end();
    })
}