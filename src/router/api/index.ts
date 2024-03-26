import { TemplatedApp } from 'uWebSockets.js'
import v1 from './v1/index.js'

export default (server: TemplatedApp) => {
    v1(server);
    return server;
}