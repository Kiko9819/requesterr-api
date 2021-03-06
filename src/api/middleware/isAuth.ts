import jwt from 'express-jwt';
import config from '../../config/public';

const getTokenFromHeader = req => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let data = req.headers.authorization.split(' ')[1];
        return data;
    }
    return null;
}

const isAuth = jwt({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm], // JWT Algorithm
    userProperty: 'access_token', // Use req.token to store the JWT
    getToken: getTokenFromHeader, // How to extract the JWT from the request
})

export default isAuth;