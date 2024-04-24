const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    
    process.exit(1);
});

const app = require('./app');
const { PORT, APP_URL } = require('./utils/secrets');

const port = PORT || 3000

const server = app.listen(port, () => {
    console.log(`Server has started @ ${APP_URL + ':' + PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');

    server.close(() => {
        process.exit(1);
    }); 
});
