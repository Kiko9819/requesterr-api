import dependencyInjector from './dependencyInjector';
import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';
import Models from './models';

export default async({expressApp}) => {
    const sqlize = await mysqlLoader();

    const {UserModel, RoleModel, UserTokenModel} = await Models(sqlize);
    // token model with userId as foreign key and token as token value
    // each user will have only one token at a time and each token will belong to only one user at a time
    // user token is not allowed to be null
    // when user is deleted, token should also be deleted
    // invalidate on logout!?!?

    await dependencyInjector({
        mysqlConnection: sqlize,
        sequelizeModels: [
            {
                name: 'UserModel',
                model: UserModel
            },
            {
                name: 'RoleModel',
                model: RoleModel
            },
            {
                name: 'TokenModel',
                model: UserTokenModel
            }
        ]
    });
    Logger.info('Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded');
}
