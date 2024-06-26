import { ChildProcess, spawn } from 'child_process';

let serverProcess: ChildProcess;
export const serverStop = () => {
    if (serverProcess?.kill) serverProcess.kill();
}
export default async (watch?: boolean) => {
    return new Promise<void>((res, rej) => {
        serverProcess = spawn("node", ["server.js"], {
            env: {
                NODE_OPTIONS: "--max-old-space-size=8192",
            },
            cwd: "./build",
            stdio: watch?'inherit':'pipe',
            detached: false,
        }).on("close", () => {
            res();
        });
    });
}
