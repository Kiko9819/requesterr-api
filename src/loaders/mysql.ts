import { Sequelize } from "sequelize";
import Logger from './logger';
import config from '../config/public';

export default async(): Promise<Sequelize> => {
    const sequelize = new Sequelize({
        database: config.databaseName,
        username: config.databaseRootUser,
        password: config.databaseRootPassword,
        host: config.databaseHost,
        dialect: "mysql",
        port: +config.databasePort
    });

    try {
        await sequelize.authenticate();
        Logger.info('Connection has been established successfully.');
    } catch (error) {
        Logger.error('Unable to connect to the database:', error);
    }

    return sequelize;
}