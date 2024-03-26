import stream from 'stream'
import streamPromise from 'stream/promises'
import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'

const flags = "w";
export default async (from: string, to: string, on?: Function) => {
    if (on) {
        let totalBytes = 0;
        let dirname = path.dirname(to);
        await fsPromise.mkdir(dirname, {recursive: true});
        return streamPromise.pipeline(
            fs.createReadStream(from),
            new stream.Transform({
                transform(chunk, encoding, callback){
                    totalBytes += chunk.length;
                    this.push(chunk);
                    on(totalBytes);
                    callback();
                }
            }),
            fs.createWriteStream(to, {
                flags: flags,
            }),
        )
    } else {
        return fsPromise.cp(from, to, {
            force: true,
            recursive: true,
        });
    }
}