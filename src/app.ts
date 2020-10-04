import express from 'express';
import config from './config/public';

async function startServer() {
    const app = express();

    await require('./loaders/public').default({expressApp: app});

    app.listen(config.port, () => {
            // process.exit(1);
        console.log(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    });
}

startServer();
