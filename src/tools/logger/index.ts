import Logger from './class.js'
import locale from '@tools/locale/index.js'

console.clear();
const log = new Logger();
log.log(locale._("log-Initialize-Logger"));
log.spinnerStart("  ", locale._("log-Loading-Logger"));
log.spinnerStop(log.config.successLevel, "  ", locale._("log-Loaded-Logger"));
export default log