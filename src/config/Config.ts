import {Utils} from "../utils/Utils";

import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IConfigData} from "./IConfigData";


import {ConfigHandler} from "./ConfigHandler";
import {FileSupport} from "../filesupport/FileSupport";
import {IJarOptions} from "./IJarOptions";
import {DEFAULT_JAR_NAME} from "../types";
import {ConfigSupport} from "./ConfigSupport";


export class Config {

    private static DEFAULT_OPTIONS: IOptions = {
        fileSupport: FileSupport.DEFAULT_TYPES,
        // handlers: {}DEFAULT_HANDLER,
        configs: [
            {
                type: 'system'
            }
        ]
    }

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
            this.$self._options(this.DEFAULT_OPTIONS)
        }

        return this.$self
    }

    isInitialized() {
        return this.$init
    }


    static jar(name: string | IJarOptions = 'default', jar?: ConfigJar): ConfigJar {
        return this.instance(false)._jar(name, jar)
    }

    _jar(name: string | IJarOptions = 'default', jar?: ConfigJar, override: boolean = false): ConfigJar {
        let options: IJarOptions = {namespace: DEFAULT_JAR_NAME}
        let _name: string = null
        if (!Utils.isString(name)) {
            options = <IJarOptions>name
            _name = options.namespace
        } else {
            _name = <string>name
        }

        if (this.$jars[_name] && !jar) {
            // jar already exists
            if (options && override) {
                this.$jars[_name] = ConfigJar.create(options)
            }
        } else if (this.$jars[_name] && jar) {
            if (!override) {
                throw new Error('config jar is already set')
            }
            this.$jars[_name] = jar
        } else if (!this.$jars[_name] && jar) {
            this.$jars[_name] = jar
        } else {
            this.$jars[_name] = ConfigJar.create(options)
        }
        return this.$jars[_name]
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
        let self = this
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
            let handler: ConfigSupport<any> = ConfigHandler.getHandlerByType(_config.type, _config, self._jarsData)
            if (handler) {
                handler.create()

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