import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IJarOptions} from "./IJarOptions";
import {IConfigData} from "./IConfigData";
import {Utils} from "../utils/Utils";

import {DEFAULT_TYPES, FileSupport} from "../filesupport/FileSupport";

import {ConfigHandler, DEFAULT_HANDLER} from "./ConfigHandler";
import {IConfigSupport} from "./IConfigSupport";


const DEFAULT_OPTIONS : IOptions = {
    fileSupport: DEFAULT_TYPES,
    handlers: DEFAULT_HANDLER,
    configs: [
        {
            type: 'system'
        }
    ]
}


export class Config {

    private static $self:Config = null

    private $options: IOptions = {};

    private $jars: { [k: string]: ConfigJar } = {};


    private constructor() {

    }

    static instance(): Config {
        if(!this.$self){
            this.$self = new Config()
            this.$self._options(DEFAULT_OPTIONS)
        }
        return this.$self
    }



    static jar(name: string = 'default', jar?: ConfigJar | IJarOptions): ConfigJar {
        return this.instance()._jar(name,jar)
    }

    _jar(name: string = 'default', jar?: ConfigJar | IJarOptions): ConfigJar {
        if (this.$jars[name] && !jar) {
            return this.$jars[name]
        } else if (this.$jars[name] && jar) {
            throw new Error('config jar is already set')
        } else if (!this.$jars[name] && jar) {
            if (jar instanceof ConfigJar) {
                this.$jars[name] = jar
            } else {
                if (!jar.namespace) {
                    jar.namespace = name
                }
                this.$jars[name] = new ConfigJar(jar)
            }
            return this.$jars[name]
        } else {
            let jar = new ConfigJar({namespace: name})
            return this._jar(jar.namespace, jar)
        }
    }

    // TODO return immutable
    static get jars(): ConfigJar[] {
        return this.instance()._jars
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
        return this.instance()._jarsData
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
        return this.instance()._hasJar(name)
    }

    _hasJar(name: string): boolean {
        return !!this.$jars[name]
    }

    static options(options: IOptions = {}, append: boolean = true) {
        this.instance()._options(options, append)
    }

    _options(options: IOptions = {}, append: boolean = true) {
        if(append){
            this.$options = Utils.merge(this.$options, options)
        }else{
            // clear current jars
            this.$jars = {}
            Object.assign(this.$options,options)
        }

        if (this.$options.fileSupport) {
            FileSupport.reload(this.$options.fileSupport)
        }

        if (this.$options.handlers) {
            ConfigHandler.reload(this.$options.handlers)
        }

        this.$options.configs.forEach(_config => {
            let handler: IConfigSupport = ConfigHandler.getHandlerByType(_config.type)
            if (handler) {
                handler.create(_config)
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