import { TemplatedApp } from 'uWebSockets.js'

export default (server: TemplatedApp) => {
    return server.get("/v1/ping", (res, req) => {
        console.log("post /v1/ping");
        console.log(req.getQuery());
        req.forEach((key, value) => {
            console.log(key, value);
        });
        res.writeStatus('200 OK')
        .writeHeader('Access-Control-Allow-Origin', '*')
        .writeHeader('Content-Type', 'application/json')
        .end(`{"arrival":${Date.now()}}`);
    });
}