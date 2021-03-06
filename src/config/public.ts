// will be used to export general project configurations
import dotenv from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
    // This error should crash whole process

    throw new Error("Couldn't find .env file️");
}

export default {
    /**
     * Your favorite port
     */
    serverPort: parseInt(process.env.PORT, 10),

    /**
     * Database host
     */
    databaseHost: process.env.MYSQL_HOST,

    /**
     * Database name
     */
    databaseName: process.env.MYSQL_DATABASE,

    /**
     * Root user
     */
    databaseRootUser: process.env.MYSQL_ROOT_USER,

    /**
     * Root password
     */
    databaseRootPassword: process.env.MYSQL_ROOT_PASSWORD,

     /**
     * Database port number
     */
    databasePort: process.env.MYSQL_DATABASE_PORT,

    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    /**
     * Your secret sauce
     */
    jwtAlgorithm: process.env.JWT_ALGO,
    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
    /**
     * This will be used by the Winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly'
    }
};
