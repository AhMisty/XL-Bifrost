import path from 'path'
import file_copy from './file_copy.js'
import file_readdir from './file_readdir.js'

export default async () => {
    await file_copy("./src/package.json", "./build/package.json");
    await file_copy("./src/langs/", "./build/langs/");
    await file_copy("./public/", "./build/public/");
    let engine = (await file_readdir("./library")).find(element => path.extname(element)==".node");
    await file_copy("./library/schema.prisma", "./build/library/schema.prisma");
    await file_copy(`./library/${engine}`, `./build/library/${engine}`);
    await file_copy(`./node_modules/uWebSockets.js/uws.js`, `./build/library/uws.cjs`);
    await file_copy(`./node_modules/uWebSockets.js/uws_${process.platform}_${process.arch}_${process.versions.modules}.node`, `./build/library/uws_${process.platform}_${process.arch}_${process.versions.modules}.node`);
}