import Config from '@/src/config.type.js';
import config from '#config'
import logger from '@tools/logger/index.js'
import { PrismaClient } from '@/library/index.js'
import exec from '@tools/exec/index.js'
import locale from '@tools/locale/index.js'

export default class Database {
    config: Config["data"] = config.data;
    data: PrismaClient | any;
    logger = logger;
    getUrl = () => {
        return encodeURI(this.config.protocol) + "://" +
        encodeURI(this.config.host) + ":" +
        encodeURI(`${this.config.port}`) + "/" +
        encodeURI(this.config.name);
    }
    getCompleteUrl = () => {
        return encodeURI(this.config.protocol) + "://" +
        encodeURI(this.config.user) + ":" +
        encodeURI(this.config.password) + "@" +
        encodeURI(this.config.host) + ":" +
        encodeURI(`${this.config.port}`) + "/" +
        encodeURI(this.config.name);
    }
    init = async () => {
        if (this.data?.$disconnect) await this.data.$disconnect();
        this.logger.log(locale._("log-Initialize-Database"));
        logger.spinnerStart("  ", locale._("log-Loading-Database"));
        this.data = new PrismaClient({
            datasourceUrl: this.getCompleteUrl(),
        });
        logger.spinnerStop(logger.config.successLevel, "  ", locale._("log-Loaded-Database"));
    }
    connect = async () => {
        this.logger.log(locale._("log-Initialize-Database-Source"));
        return this.logger.spinnerPromise(
            "  ",
            locale._("log-Loading-Database-Source", this.getUrl()),
            locale._("log-Load-Database-Source-Success"),
            locale._("log-Load-Database-Source-Faild"),
            this.data.$connect(),
        );
    }
    create = async () =>{
        this.logger.log(locale._("log-Create-New-Database"));
        return logger.spinnerPromise(
            "  ", 
            locale._("log-Creating-New-Database", this.getUrl()),
            locale._("log-Create-New-Database-Success"),
            locale._("log-Create-New-Database-Faild"),
            exec("npx prisma migrate deploy", {
                env: {
                    DATABASE_URL: this.getCompleteUrl(),
                },
            })
        );
    }
}