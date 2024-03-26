import config from '#config'
import { I18n } from 'i18n'

class Locale {
    config = config.locale;
    locale!: I18n;
    constructor () {
        this.init();
    }
    init = () => {
        return this.locale = new I18n({
            directory: this.config.path,
            defaultLocale: this.config.defaultLocale,
            updateFiles: false,
            extension: '.json',
        });
    }
    getDirectory = () => {
        return this.config.path;
    }
    setDirectory = (path: string) => {
        this.config.path = path;
        return this.init();
    }
    getLocale = () => {
        return this.locale.getLocale();
    }
    setLocale = (locale: string) => {
        if (this.getLocales().includes(this.getLocale())) return this.locale.setLocale(locale);
        return false;
    }
    getLocales = () => {
        return this.locale.getLocales();
    }
    _ = (phraseOrOptions: string | i18n.TranslateOptions, ...replace: string[]) => {
        return this.locale.__(phraseOrOptions, ...replace);
    }
}
export default Locale