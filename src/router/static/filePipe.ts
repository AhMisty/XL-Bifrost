import { Readable } from 'stream';
import { HttpResponse } from 'uWebSockets.js'

export default (res: HttpResponse, readble: Readable, size: number) => {
    let aborted = false;
    let done = false;
    res.onAborted(() => {
        aborted = true;
    });
    readble.on("data", (chunk: Buffer) => {
        if (done || aborted) {
            readble.destroy();
            return;
        }
        let buffer = chunk.buffer.slice(
            chunk.byteOffset,
            chunk.byteOffset + chunk.byteLength
        );
        let lastOffset = res.getWriteOffset();
        res.cork(() => {
            let [ok, _done] = res.tryEnd(buffer, size);
            if (_done) {
                done = true;
            } else if (!ok) {
                readble.pause();
                res.onWritable((offset) => {
                    if (done || aborted) {
                        readble.destroy();
                        return true;
                    }
                    let [writeOk, writeDone] = res.tryEnd(
                        buffer.slice(offset - lastOffset),
                        size
                    );
                    if (writeDone) {
                        done = true;
                    } else if (writeOk) {
                        readble.resume();
                    }
                    return writeOk;
                });
            }
        });
    });
    return res;
};