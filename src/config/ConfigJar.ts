import {IOptions} from "./IOptions";
import {FileSupport} from "../filesupport/FileSupport";

import {IConfigData} from "./IConfigData";
import {IConfigOptions} from "./IConfigOptions";
import {IJarOptions} from "./IJarOptions";
import {mergeDeep} from "typescript-object-utils";
import {Utils} from "../utils/Utils";
import {InterpolationSupport} from "../supports/InterpolationSupport";
import {Config} from "./Config";
import {Source} from "./Source";
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
    standalone:false,
    interpolate:true
}

export class ConfigJar {

    private _options: IJarOptions;

    // private _config:

    private _data: IConfigData = {}

    /**
     *
     */
    private _source: Source[] = []

    constructor(options: IJarOptions = DEFAULT_JAR_OPTS) {
        this._options = Utils.merge(DEFAULT_JAR_OPTS,options)
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

    merge(data: IConfigData|Source, opts:{interpolate:boolean} = {interpolate:true}){

        let source = data
        if(data instanceof Source){
            source = Utils.clone(data)
            this._source.push(<Source>source)
            data = (<Source>source).data

            if((<Source>source).prefix){
                let _data={}
                Utils.set(_data,(<Source>source).prefix,data)
                data = _data
            }
        }

        if(this._options.interpolate && opts.interpolate){
            // interpolate first then merge
            let collection:IConfigData[] = Config.jarsData

            // interpolate against self execute
            if(!Config.hasJar(this.namespace)){
                collection.push(this._data)
            }
            collection.unshift(data)
            InterpolationSupport.exec(data,collection)
        }

        this._data = Utils.merge(this._data, data)
    }

    /**
     * Execute interpolation over the config data
     */
    runInterpolation(){
        InterpolationSupport.exec(this._data)
    }

    interpolateAgainst(data:IConfigData){
        InterpolationSupport.exec(data,this._data)
        return data;
    }

    static create(options:IJarOptions = {namespace:'default'}):ConfigJar{
        if(!options.namespace){
            options.namespace = 'default'
        }
        let jar = new ConfigJar(options)
        return jar
    }

}