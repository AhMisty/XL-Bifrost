import esbuild, { BuildOptions, PluginBuild } from 'esbuild'
import index_clean from './index_clean.js'
import index_copy from './index_copy.js'
//import data_build from './data_build.js'
import index_serve, { serverStop } from './index_serve.js'
import chalk from 'chalk'
import log from './index_log.js'

let indexbuilded = false;
let timestamp = Date.now();
const indexBuildDevPlugin = {
    name: 'indexBuildDevPlugin',
    setup (build: PluginBuild) {
        build.onStart(async ()=>{
            timestamp = Date.now();
            indexbuilded = false;
            log.stop();
            console.log("   - Rebuilding the Project.");
            log.start("Rebuilding");
            try{
                serverStop();
                await index_copy();
            }catch(e){}
        });
        build.onEnd((result) => {
            log.stopAndPersist({
                text: chalk.green(`Build ended with ${result.errors.length} errors.\n    ⚡ Done in ${Date.now() - timestamp}ms.`),
                symbol: chalk.green("✓"),
            });
            if (result.errors.length === 0) {
                indexbuilded = true;
                console.log("   - Running the Server.");
                log.start("- Start running the server on the path './build/server.js'.");
                index_serve(true);
                log.stopAndPersist({
                    text: chalk.green("Running './build/server.js'."),
                    symbol: chalk.green("✓"),
                });
            } else {
                indexbuilded = false;
            }
        });
    },
}
const configBuildDevPlugin = {
    name: 'configBuildDevPlugin',
    setup (build: PluginBuild) {
        build.onStart(()=>{
            serverStop();
        });
        build.onEnd((result) => {
            if (result.errors.length === 0 && indexbuilded) {
                console.log("   - Reloading the Server.");
                log.start("- Start running the server on the path './build/server.js'.");
                index_serve(true);
                log.stopAndPersist({
                    text: chalk.green("Running './build/server.js'."),
                    symbol: chalk.green("✓"),
                });
            }
        });
    },
}
const indexBuildOptions = (watch?: boolean) => {
    return {
        entryPoints: ["src/server.ts"],
        bundle: true,
        minify: true,
        banner: {
            js: `import {createRequire} from"module";import {fileURLToPath} from"url";import path from"path";const require=createRequire(import.meta.url);const __filename=fileURLToPath(import.meta.url);const __dirname=path.dirname(__filename);`,
        },
        platform: "node",
        outfile: "./build/server.js",
        format: "esm",
        target: "esnext",
        treeShaking: true,
        external: [
            "#config",
            "#uWebSockets",
        ],
        legalComments: "none",
        loader: {
        },
        plugins: watch?[indexBuildDevPlugin]:[],
    } as BuildOptions;
}
const configBuildOptions = (watch?: boolean) => {
    return {
        entryPoints: ["src/config.ts"],
        platform: "node",
        outfile: "./build/config.js",
        format: "esm",
        target: "esnext",
        treeShaking: true,
        plugins: watch?[configBuildDevPlugin]:[],
    } as BuildOptions;
}
process.on('SIGINT', () => {
    serverStop();
    process.exit();
});
export default async (watch?: boolean) => {
    timestamp = Date.now();
    log.prefixText = "  ";
    console.log(" - Clean up build folder.");
    log.start("Cleaning up");
    await index_clean("./build");
    log.stopAndPersist({
        text: chalk.green("Clean up successful."),
        symbol: chalk.green("✓"),
    });
    console.log(" - Rebuilding the database engine.");
    log.start("Rebuilding");
    //await data_build();
    log.stopAndPersist({
        text: chalk.green("Rebuilding successful."),
        symbol: chalk.green("✓"),
    });
    if (watch) {
        console.log(" - Watching the Project.");
        log.prefixText = "    ";
        esbuild.context(indexBuildOptions(watch)).then((ctx) => {
            ctx.watch();
        });
        esbuild.context(configBuildOptions(watch)).then((ctx) => {
            ctx.watch();
        });
    } else {
        console.log(" - Rebuilding the Project.");
        log.start("Rebuilding");
        await esbuild.build(indexBuildOptions(watch));
        await esbuild.build(configBuildOptions(watch));
        await index_copy();
        log.stopAndPersist({
            text: chalk.green("Rebuilding successful."),
            symbol: chalk.green("✓"),
        });
        console.log(chalk.green(`\n⚡ Done in ${Date.now() - timestamp}ms.`));
    }
}