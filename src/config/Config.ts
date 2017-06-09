
import {IConfigOptions} from "./IConfigOptions";
import {ConfigJar} from "./ConfigJar";



export class Config {

    private static $instance:ConfigJar = new ConfigJar();


    private constructor(){}


    static options(options : IConfigOptions){
        return Config.instance().options(options);
    }


    static loadFromFile(path:string){
        //Config.instance()._loadFromFile(path;
    }

    static loadFromDirectory(path:string){}

    static get(path:string){}

    static set(path:string, value:any){}



    private static instance(){
        return Config.$instance;
    }


}