const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express();

const port = process.env.port || 3000;
let refreshTokens = {};
const SECRET = "SECRET_ENCRIPTION";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    done(null, username);
});


const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = SECRET;

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    const expirationDate = new Date(jwtPayload.exp * 1000);

    if(expirationDate < new Date()) {
        return done(null, false);
    }

    const user = jwtPayload;
    done(null, user);
}))

app.get('/test_jwt', passport.authenticate('jwt'), (req, res) => {
    res.json({
        success: 'You are authenticated with JWT',
        user: req.user
    });
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = {
        'username': username,
        'role': 'admin'
    };

    const token = jwt.sign(user, SECRET, {expiresIn: 300});
    const refreshToken = randToken.uid(256);
    refreshTokens[refreshToken] = username;
    res.json({
        access_token: token,
        refresh_token: refreshToken
    });
})

// endpoint for new access token
app.post('/token', (req, res, next) => {
    const username = req.body.username;
    const refreshToken = req.body.refreshToken;

    if((refreshToken in refreshTokens) && refreshTokens[refreshToken] == username) {
        const user = {
            'username': username,
            'role': 'admin'
        }
    } else {
        res.send(401);
    }
})

app.post('/token/reject', (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if(refreshToken in refreshTokens) {
        delete refreshTokens;
    }
    res.send(204);
});

app.listen(port, () => {
    console.log('listening on port', port)
});