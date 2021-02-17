import * as http from "http";
import config from "config";
import express, { Request, Response } from 'express';
import LoggerService from './components/logger';
import apis from './routes/api/apis';

import path from "path";
import cookieParser from 'cookie-parser';


const app = express();
const server = http.createServer(app);
const logger = new LoggerService('app.ts');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


printNodeEnv();

const port: number = config.get('App.port');
logger.info(`Listening at ${port}`);
server.listen(port);

function printNodeEnv(): void {
    if (process.env.NODE_ENV === 'production') {
        logger.info('production');
    } else {
        logger.info('development');
    }
}

// All apis
app.use(apis);


// error handler middleware
app.use((error, req, res, nextFunction) => {
    logger.error(`Error while executing a API - ${error}`);
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: 'Internal Server Error'
        }
    });
});

export default server;
