import { Router } from "express"
import auth from "./routes/auth";
import user from "./routes/user";

// setup and expose app
export default () => {
    const router = Router();
    auth(router);
    user(router);

    return router;
}