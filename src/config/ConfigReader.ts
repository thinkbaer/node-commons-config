

import {IConfigReaderInfo} from "./IConfigReaderInfo";
import {ClassLoader} from "../utils/ClassLoader";
import {IConfigReader} from "./IConfigReader";
import {Utils} from "../utils/Utils";
export class ConfigReader {

    private static $reader: IConfigReaderInfo[] = [];

    /**
     * Loades classes in *.js or *.ts files from given directories, verifing if they implement the
     * IConfigReader interface. For each valid class an info entry is created and added to $reader
     *
     * @param directories
     */
    static reload(directories : string|string[]):boolean{
        ConfigReader.reset()

        if(typeof directories === 'string'){
            directories = [directories]
        }
        let classes = ClassLoader.importClassesFromDirectories(directories);

        classes.forEach((klass:Function) => {

            let info : IConfigReaderInfo = {
                klass:klass,
                ext:[],
                enabled:false,
                parseable:false,
                readable:false,
            }

            let l = Reflect.construct(klass,[])
            if(l.supportedTypes !== undefined){
                let types = l.supportedTypes()
                if(typeof types === 'string'){
                    info.ext = [types]
                }else{
                    info.ext = types
                }
            }
            if(l.requirements !== undefined){
                try{
                    l.requirements()
                    info.enabled = true
                }catch(e){
                    console.log('WARNING: executing requirements for '+l + ' failed, this types cannot be loaded')
                }
            }else{
                info.enabled = true
            }

            info.readable = l.read !== undefined
            info.parseable = l.parse !== undefined
            ConfigReader.$reader.unshift(info)
        })

        return ConfigReader.$reader.length > 0
    }

    static getSupportedTypes(force_all:boolean = false):string[]{
        let types :string[] = []
        ConfigReader.$reader.forEach((_x)=>{
            if(_x.enabled || force_all){
                types = types.concat(_x.ext)
            }
        })
        return Utils.unique_array(types)
    }

    static amount(){
        return ConfigReader.$reader.length
    }

    static getReaderForExtension(ext:string):IConfigReader{
        for(let i = 0; i < ConfigReader.$reader.length;i++){
            if(ConfigReader.$reader[i].ext.indexOf(ext) > -1){
                let instance = Reflect.construct(ConfigReader.$reader[i].klass,[])
                return instance
            }
        }
        return null
    }


    static reset(){
        ConfigReader.$reader = []
    }





}