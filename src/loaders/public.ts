import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';
import Models from './models';

export default async({expressApp}) => {
    const sqlize = await mysqlLoader();

    const models = await Models(sqlize);

    models.UserModel.create({
        name: "Ivan",
        email: "ivan@gmail.com",
        password: "secret"
    });
    
    await expressLoader({ app: expressApp });
    Logger.info('Express loaded')
}
