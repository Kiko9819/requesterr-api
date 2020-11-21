import { Request, Response, Router } from 'express';

const route = Router();

export default (app: Router) => {

    app.use('/users', route);

    route.get('/me', (req: Request, res: Response) => {
        return res.json({
            user: "Za sq e tva"
        }).status(200);
    })
}
