import { NextFunction, Request, Response } from 'express';
import config from '../../config/public';

const checkSecret = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Basic') {
        let atobBuffer = req.headers.authorization.split(' ')[1];
        const atobStringified = Buffer.from(atobBuffer, 'base64').toString()

        if(atobStringified === config.jwtSecret) {
            return next();
        }
    }
    return res.status(400).send({message: "Invalid secret"});
}

export default checkSecret;