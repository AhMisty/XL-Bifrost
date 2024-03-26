import { TemplatedApp } from 'uWebSockets.js'
import pingRouter from './ping/index.js'

export default (server: TemplatedApp) => {
    pingRouter(server);
    return server;
}