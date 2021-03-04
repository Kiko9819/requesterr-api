import dependencyInjector from './dependencyInjector';
import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';
import Models from './models';

export default async({expressApp}) => {
    const sqlize = await mysqlLoader();

    const {UserModel, RoleModel} = await Models(sqlize);

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
            }
        ]
    });
    Logger.info('Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded')
}
