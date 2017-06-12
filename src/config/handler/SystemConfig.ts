import * as os from 'os'
import {IConfigSupport} from "../IConfigSupport";
import {IConfigData} from "../IConfigData";
import {mergeDeep} from "typescript-object-utils";
import {ConfigJar} from "../ConfigJar";
import {IConfigOptions} from "../IConfigOptions";
import {Config} from "../Config";


/**
 * Load passthrough arguments configuration
 *
 * Named arguments beginning with '--' will be stripped of '--' and put as key-value pair in the array.
 * If no value is set then the value will be 'true'.
 */
export class SystemConfig implements IConfigSupport{

    type():string {
        return 'system';
    }

    private attach_os(jar:ConfigJar){

        jar.set('os.hostname',os.hostname())
        jar.set('os.userdir',os.homedir())
        jar.set('os.platform',os.platform())

        return jar
    }

    private attach_env(jar:ConfigJar){

        let data = mergeDeep({},process.env)
        let configData : IConfigData = {}
        Object.keys(data).forEach(k => {
            configData[k.toLocaleLowerCase()] = data[k]
        })
        jar.merge({env:configData})

        return jar
    }

    private attach_argv(jar:ConfigJar){
        let data : IConfigData = {}
        let i=0
        let pl = process.argv.length

        for(let k=0;k<pl;k++){
            let v = process.argv[k]
            if(/^\-\-/.test(v)){
                let n = k + 1
                if(n < pl){
                    let next = process.argv[n]
                    if(!/^\-\-/.test(next)){
                        k++
                        data[v.replace(/^\-\-/,'')] = next
                    }else{
                        data[v.replace(/^\-\-/,'')] = true
                    }
                }else{
                    data[v.replace(/^\-\-/,'')] = true
                }
            }else{
                data['_'+i] = v
                i++
            }
        }

        jar.merge({argv:data})

        return jar
    }


    bootstrap(options?:IConfigOptions):ConfigJar{
        let jar = Config.jar('system')
        this.attach_os(jar)
        this.attach_env(jar)
        this.attach_argv(jar)
        return jar
    }

}