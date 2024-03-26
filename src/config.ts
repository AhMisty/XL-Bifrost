import Config from './config.type.js'

const config: Config = {
    platform: {
        name: "XLBifrost",
    },
    locale: {
        defaultLocale: "zh-cn",
        path: "./langs",
    },
    api: {
        enable: true,
    },
    static: {
        enable: true,
        pattern: "/*",
        patternBase: "",
        path: "./public/",
        default: "index.html",
        404: {
            enable: true,
            path: "/index.html",
        },
        option: {
            static: false,
            filter: {
                keep: {
                    extensions: ["html", "css", "js", "json", "png", "jpg", "jpeg"],
                },
                ignore: (path: string) => {
                    return path.startsWith(".");
                },
            },
            cache: {
                max_file_count: 128,
                max_file_size: 8*1024*1024,
            },
        },
    },
    data: {
        provider: "mysql",
        protocol: "mysql",
        user: "",
        password: "",
        host: "localhost",
        port: 3306,
        name: "Bifrost"
    },
    logger: {
        silent: false,
        level: "silly",
        dateFormat: "YYYY-MM-DD HH:mm:ss",
        path: "./logs",
        fileSlient: false,
        fileLevel: "silly",
        fileNameDateFormat: "YYYY-MM-DD-HH",
        maxSize: "16m",
        maxFiles: "16d",
        defaultLevel: "info",
        successLevel: "silly",
        failLevel: "error",
    },
}
export default config