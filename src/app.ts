import express from 'express';

async function startServer() {
    const app = express();

    await require('./loaders').default({expressApp: app});

    app.listen(3000, (err) => {
        if (err) {
            process.exit(1);
        }
        console.log(`
      ################################################
      🛡️  Server listening on port: 3000 🛡️ 
      ################################################
    `);
    });
}

startServer();
