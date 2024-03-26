import { HttpRequest, HttpResponse, TemplatedApp } from 'uWebSockets.js'
import config from '#config'
import LiveDirectory from 'live-directory'
import path from 'path'
import mime from 'mime/lite'
import LiveFile from 'live-directory/types/components/LiveFile.js'
import filePipe from './filePipe.js'

const patternBaseLength = config.static.patternBase.length;
const defaultFile = config.static.default;
const LiveAssets = new LiveDirectory(config.static.path, config.static.option);
let mimeMap = new Map();
LiveAssets.on("add", (filePath: string) => {
    mimeMap.set(filePath, mime.getType(path.extname(filePath)));
});
LiveAssets.on("delete", (filePath: string) => {
    mimeMap.delete(filePath);
});
const trySendFile = () => {}
const handle = (res: HttpResponse, req: HttpRequest) => {
    try {
        let reqFilePath = req.getUrl().slice(patternBaseLength);
        if (reqFilePath.endsWith("/")) reqFilePath = reqFilePath + defaultFile;
        let file = LiveAssets.get(reqFilePath);
        if (file) {
            res.cork(() => {
                res.writeStatus("200 OK").writeHeader("Content-Type", `${mimeMap.get(reqFilePath)||mime.getType(path.extname(reqFilePath))||"application/octet-stream"}`);
            });
            if (file.cached) {
                res.cork(() => {
                    res.end((file as LiveFile).content);
                });
            } else {
                //pipeline流式传输
                res.cork(() => {
                    filePipe(res, (file as LiveFile).stream(), (file as LiveFile).stats.size);
                });
            }
        } else {
            if (config.static[404].enable) {
                res.cork(() => {
                    //404页面处理
                    res.end("404");
                });
            } else {
                res.cork(() => {
                    req.setYield(true);
                });
            }
        }
    } catch (error) {
        console.log(error);
        if (res?.close instanceof Function) res.close();
    }
}
export default (server: TemplatedApp) => {
    server.get(config.static.pattern, (res, req) => {
        res.cork(() => {
            handle(res, req);
        });
    });
    return server;
}