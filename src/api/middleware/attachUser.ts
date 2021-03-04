import Container from "typedi"

const attachCurrentUser = async(req, res, next) => {
    try {
        const userModel: any = Container.get('UserModel');
        const userRecord = await userModel.findByPk(req.access_token.id);
        
        if(!userRecord) {
            return res.send(401);
        }

        Reflect.deleteProperty(userRecord, 'password');
        req.currentUser = userRecord;

        return next();
    } catch(e) {
        return next(e);
    }
}

export default attachCurrentUser;