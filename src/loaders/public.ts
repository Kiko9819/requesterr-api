import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';

export default async({expressApp}) => {
    await mysqlLoader();

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded')
}
