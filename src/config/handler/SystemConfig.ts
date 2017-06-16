import * as os from 'os'


import {IConfigData} from "../IConfigData";
import {ConfigJar} from "../ConfigJar";
import {IConfigOptions} from "../IConfigOptions";
import {Source} from "../Source";
import {Utils} from "../../utils/Utils";
import {ConfigSupport} from "../ConfigSupport";
import {Config} from "../Config";


/**
 * Load passthrough arguments configuration
 *
 * Named arguments beginning with '--' will be stripped of '--' and put as key-value pair in the array.
 * If no value is set then the value will be 'true'.
 */
export  class SystemConfig extends ConfigSupport<IConfigOptions> {

    constructor(options:IConfigOptions = {namespace:'system'}){
        super(options);
    }

    type(): string {
        return 'system';
    }

    private attach_os(jar: ConfigJar) {

        let _os = {
            hostname: os.hostname(),
            userdir: os.homedir(),
            platform: os.platform(),
        }

        jar.merge(new Source({source: 'os', data: _os , prefix:'os'}))
        return jar
    }

    private attach_env(jar: ConfigJar) {

        let data = Utils.merge({}, process.env)
        let configData: IConfigData = {}
        Object.keys(data).forEach(k => {
            configData[k.toLocaleLowerCase()] = data[k]
        })
        jar.merge(new Source({source: 'env', data: configData, prefix:'env'}))

        return jar
    }

    private attach_argv(jar: ConfigJar) {
        let data: IConfigData = {}
        let i = 0
        let pl = process.argv.length

        for (let k = 0; k < pl; k++) {
            let v = process.argv[k]
            if (/^\-\-/.test(v)) {
                let n = k + 1
                if (n < pl) {
                    let next = process.argv[n]
                    if (!/^\-\-/.test(next)) {
                        k++
                        data[v.replace(/^\-\-/, '')] = next
                    } else {
                        data[v.replace(/^\-\-/, '')] = true
                    }
                } else {
                    data[v.replace(/^\-\-/, '')] = true
                }
            } else {
                data['_' + i] = v
                i++
            }
        }

        jar.merge(new Source({source: 'argv', data: data, prefix:'argv'}))

        return jar
    }


    create(): ConfigJar {
        let jar = Config.jar({namespace:'system'})
        this.attach_os(jar)
        this.attach_env(jar)
        this.attach_argv(jar)
        return jar
    }

}