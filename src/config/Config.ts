



import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IConfigOptions} from "./IConfigOptions";
import {IJarOptions} from "./IJarOptions";
import {IConfigData} from "./IConfigData";


const DEFAULT_OPTIONS:IOptions = {

    configs: [{type:'system'}]
}


export class Config {

    private static $options:IOptions;

    private static $jars: {[k:string]:ConfigJar} = {};


    private constructor(){}


    static jar(name:string = 'default', jar?:ConfigJar|IJarOptions):ConfigJar{

        if(this.$jars[name] && !jar){
            return this.$jars[name]
        }else if(this.$jars[name] && jar){
            throw new Error('config jar is already set')
        }else if(!this.$jars[name] && jar){
            if(jar instanceof ConfigJar){
                this.$jars[name] = jar
            }else{
                if(!jar.namespace){
                    jar.namespace = name
                }
                this.$jars[name] = new ConfigJar(jar)
            }

            return this.$jars[name]
        }else{
            let jar = new ConfigJar({namespace:name})
            return this.jar(jar.namespace,jar)
        }
    }

    // TODO return immutable
    static get jars() : ConfigJar[]{
        let self = this
        let jars : ConfigJar[]= []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self[k])
        })
        return jars
    }

    static get jarsData() : IConfigData[]{
        let self = this
        let jars : IConfigData[]= []
        Object.keys(this.$jars).forEach(k => {
            jars.push(self.$jars[k].data)
        })
        return jars
    }


    static hasJar(name:string):boolean{
        return !!this.$jars[name]
    }

    static options(options : IOptions){
        return Config.$options = options;
    }



    static get(path:string){}

    static set(path:string, value:any){}



}