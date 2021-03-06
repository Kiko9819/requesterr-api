import isAuth from './isAuth';
import attachCurrentUser from './attachUser';
import checkSecret from './checkSecret';
// will be use to expose middleware
export default {
    isAuth,
    attachCurrentUser,
    checkSecret
}