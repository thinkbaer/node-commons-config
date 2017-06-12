import {IOptions} from "./IOptions";
import {FileSupport} from "../filesupport/FileSupport";
import {ISource} from "./ISource";
import {IConfigData} from "./IConfigData";
import {IConfigOptions} from "./IConfigOptions";
import {IJarOptions} from "./IJarOptions";
import {mergeDeep} from "typescript-object-utils";
import {Utils} from "../utils/Utils";
import {InterpolationSupport} from "../supports/InterpolationSupport";
import {Config} from "./Config";
/*
const DEFAULT_OPTIONS: IOptions = {
    readerDirs: [__dirname + '/../reader/*'],
    interpolate:true,
    basename: 'default',
    dir: 'config'
}
*/

const DEFAULT_JAR_OPTS : IJarOptions = {
    namespace: 'default',
    interpolate:true
}

export class ConfigJar {

    private _options: IJarOptions;

    private _data: IConfigData = {}

    /**
     *
     */
    private _source: ISource[]

    constructor(options: IJarOptions = DEFAULT_JAR_OPTS) {
        this._options = options
    }


    get namespace(){
        return this._options.namespace
    }


    get data(){
        return this._data
    }


    get(path:string):any{
        return Utils.get(this._data,path)
    }

    set(path:string, value:any):boolean{
        return Utils.set(this._data,path,value)
    }

    merge(data: IConfigData){
        if(this._options.interpolate){
            // Interpolate first then merge
            let collection:IConfigData[] = Config.jars
            if(!Config.hasJar(this.namespace)){
                collection.push(this._data)
            }

            InterpolationSupport.exec(data,collection)
        }
        this._data = Utils.merge(this._data, data)
    }

    interpolateAgainst(data:IConfigData){
        InterpolationSupport.exec(data,this._data)
        return data;
    }

    /*
    options(options: IOptions) {
        if (options.readerDirs) {

            if (!this._options.readerDirs) {
                this._options.readerDirs = []
            }

            if (options.readerDirs instanceof Array) {
                this._options.readerDirs = this._options.readerDirs.concat(options.readerDirs)
            } else if (typeof options.readerDirs === 'string') {
                this._options.readerDirs.push(options.readerDirs)
            } else {
                throw new Error('Wrong type')
            }

            delete options.readerDirs
        }

        this._options = Object.assign(this._options, options)

        FileSupport.reload(this._options.readerDirs)
    }
    */

}