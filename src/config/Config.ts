import {Utils} from "../utils/Utils";

import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IConfigData} from "./IConfigData";
import {IConfigSupport} from "./IConfigSupport";

import {ConfigHandler} from "./ConfigHandler";
import {FileSupport} from "../filesupport/FileSupport";


const DEFAULT_OPTIONS: IOptions = {
    fileSupport: FileSupport.DEFAULT_TYPES,
    // handlers: {}DEFAULT_HANDLER,
    configs: [
        {
            type: 'system'
        }
    ]
}


export class Config {

    private static $self: Config = null

    private $options: IOptions = {};

    private $jars: { [k: string]: ConfigJar } = {};

    private $init: boolean = false


    private constructor() {

    }

    static instance(init: boolean = true): Config {
        if (!this.$self) {
            this.$self = new Config()
        }

        if (!this.$self.isInitialized() && init) {
            this.$self._options(DEFAULT_OPTIONS)
        }

        return this.$self
    }

    isInitialized() {
        return this.$init
    }


    static jar(name: string = 'default', jar?: ConfigJar): ConfigJar {
        return this.instance(false)._jar(name, jar)
    }

    _jar(name: string = 'default', jar?: ConfigJar, override: boolean = false): ConfigJar {
        if (this.$jars[name] && !jar) {
        } else if (this.$jars[name] && jar) {
            if (!override) {
                throw new Error('config jar is already set')
            }
            this.$jars[name] = jar
        } else if (!this.$jars[name] && jar) {
            this.$jars[name] = jar
        } else {
            this.$jars[name] = ConfigJar.create({namespace: name})
        }
        return this.$jars[name]
    }

    // TODO return immutable
    static get jars(): ConfigJar[] {
        return this.instance(false)._jars
    }

    get _jars(): ConfigJar[] {
        let self = this
        let jars: ConfigJar[] = []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self.$jars[k])
        })
        return jars
    }

    static get jarsData(): IConfigData[] {
        return this.instance(false)._jarsData
    }

    get _jarsData(): IConfigData[] {
        let self = this
        let jars: IConfigData[] = []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self.$jars[k].data)
        })
        return jars
    }


    static hasJar(name: string): boolean {
        return this.instance(false)._hasJar(name)
    }

    _hasJar(name: string): boolean {
        return !!this.$jars[name]
    }

    static options(options: IOptions = {}, append: boolean = true) {
        this.instance()._options(options, append)
    }


    _options(options: IOptions = {}, append: boolean = true) {
        this.$init = true

        if (append) {
            this.$options = Utils.merge(this.$options, options)
        } else {
            // clear current jars
            this.$jars = {}
            Object.assign(this.$options, options)
        }

        if (this.$options.fileSupport) {
            FileSupport.reload(this.$options.fileSupport)
        }

        if (!this.$options.handlers || this.$options.handlers.length === 0) {
            this.$options.handlers = ConfigHandler.DEFAULT_HANDLER
        }
        ConfigHandler.reload(this.$options.handlers)

        this.$options.configs.forEach(_config => {
            let handler: IConfigSupport = ConfigHandler.getHandlerByType(_config.type)
            if (handler) {
                let jar: ConfigJar = handler.create(_config)
                this._jar(jar.namespace, jar, true)
            } else {
                throw new Error('handler doesn\'t exists')
            }
        })
    }


    static get(path: string, namespace?: string) {
        let jars: ConfigJar[] = this.jars
        if (namespace) {
            jars = [this.jar(namespace)]
        } else {
            jars = this.jars
        }
        let _value: any
        for (let i = 0; i < jars.length; i++) {
            _value = jars[i].get(path)
            if (_value) break;
        }
        return _value
    }

    static set(path: string, value: any, namespace: string = 'default'): boolean {
        let jar: ConfigJar = Config.jar(namespace)
        return jar.set(path, value)
    }


}