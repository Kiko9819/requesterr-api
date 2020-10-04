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
    port: parseInt(process.env.PORT, 10),

    /**
     * Connection string
     */
    databaseURL: process.env.MYSQL_DB,

    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
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
