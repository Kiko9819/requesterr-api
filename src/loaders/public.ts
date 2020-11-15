import dependencyInjector from './dependencyInjector';
import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';
import Models from './models';

export default async({expressApp}) => {
    const sqlize = await mysqlLoader();

    const models = await Models(sqlize);

    const di = await dependencyInjector({
        mysqlConnection: sqlize,
        sequelizeModels: [
            {
                name: 'UserModel',
                model: models.UserModel
            }
        ]
    });
    Logger.info('Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded')
}
