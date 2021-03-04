import { Container } from 'typedi';
import LoggerInstance from './logger';

// TODO: Fix types
export default ({mysqlConnection, sequelizeModels}) => {
    try {
        Container.set('mysqlConnection', mysqlConnection);

        sequelizeModels.forEach(model => {
            Container.set(model.name, model.model);
            LoggerInstance.info(`Dependency injector set ${model.name} to `, model.model);
        });

        Container.set('logger', LoggerInstance);
    } catch (e) {
        LoggerInstance.error("Dependency injector failed with ---- ", e);
        throw e;
    }
}
