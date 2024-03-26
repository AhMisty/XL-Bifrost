import { TemplatedApp } from 'uWebSockets.js'
import config from '#config'
import apiRouter from './api/index.js'
import staticRouter from './static/index.js'

export default (server: TemplatedApp) => {
    if (config.api.enable) apiRouter(server);
    if (config.static.enable) staticRouter(server);
    return server;
}