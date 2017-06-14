import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IConfigOptions} from "./IConfigOptions";
import {IJarOptions} from "./IJarOptions";
import {IConfigData} from "./IConfigData";
import {Utils} from "../utils/Utils";

import {SystemConfig} from "./handler/SystemConfig";
import {FileConfig} from "./handler/FileConfig";
import {JsonFileSupport} from "../filesupport/types/JsonFileSupport";
import {XmlFileSupport} from "../filesupport/types/XmlFileSupport";
import {FileSupport} from "../filesupport/FileSupport";
import {StringOrFunction} from "../types";


const DEFAULT_HANDLER: StringOrFunction[] = [
    SystemConfig,
    FileConfig
]

const DEFAULT_OPTIONS: IOptions = {
    handlers: DEFAULT_HANDLER,
    fileSupport: [
        JsonFileSupport,
        XmlFileSupport
    ],
    configs: [
        {
            type: 'system'
        }
    ]
}


export class Config {

    private static $options: IOptions = DEFAULT_OPTIONS;

    private static $jars: { [k: string]: ConfigJar } = {};


    private constructor() {
    }


    static jar(name: string = 'default', jar?: ConfigJar | IJarOptions): ConfigJar {

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
            return this.jar(jar.namespace, jar)
        }
    }

    // TODO return immutable
    static get jars(): ConfigJar[] {
        let self = this
        let jars: ConfigJar[] = []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self[k])
        })
        return jars
    }

    static get jarsData(): IConfigData[] {
        let self = this
        let jars: IConfigData[] = []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self.$jars[k].data)
        })
        return jars
    }


    static hasJar(name: string): boolean {
        return !!this.$jars[name]
    }


    static create(options: IOptions = {}) {
        this.$options = Utils.merge(options)

        if (this.$options.fileSupport) {
            FileSupport.reload(this.$options.fileSupport)
        }

        if (this.$options.handlers) {
            this.reload(this.$options.handlers)
        }
    }

    private static reload(refs: StringOrFunction | StringOrFunction[] = DEFAULT_HANDLER) {

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