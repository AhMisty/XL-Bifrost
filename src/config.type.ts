export default interface Config {
    platform: {
        name: string,
    };
    locale: {
        defaultLocale: string,
        path: string,
    };
    api: {
        enable: boolean,
    };
    static: {
        enable: boolean,
        pattern: string,
        patternBase: string,
        path: string,
        default: string,
        404: {
            enable: boolean,
            path: string,
        },
        option: {
            static: boolean,
            filter: {
                keep: {
                    extensions: string[],
                },
                ignore: any,
            },
            cache: {
                max_file_count: number,
                max_file_size: number,
            },
        },
    };
    data: {
        provider: "postgresql" | "mysql" | "mongodb" | "cockroachdb",
        protocol: "postgresql" | "mysql" | "mongodb" | "cockroachdb",
        user: string,
        password: string,
        host: string,
        port: number,
        name: string,
    };
    logger: {
        silent: boolean,
        level: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
        dateFormat: string,
        path: string,
        fileSlient: boolean,
        fileLevel: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
        fileNameDateFormat: string,
        maxSize: string,
        maxFiles: string,
        defaultLevel: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
        successLevel: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
        failLevel: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
    };
}