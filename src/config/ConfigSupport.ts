
import {ConfigJar} from "./ConfigJar";
import {IConfigData} from "./IConfigData";
import {InterpolationSupport} from "../supports/InterpolationSupport";



export abstract class ConfigSupport<T> {

    $options:T;

    constructor(options : T, jarsData:IConfigData[]=[]) {
        this.$options = options;

        // if not globally definied then load directly
        if (options && options['type'] != 'system' && jarsData && jarsData.length > 0) {
            try{
                InterpolationSupport.exec(this.$options, jarsData)
            }catch(e){

            }
        }

    }

    abstract type() : string

    abstract create() : ConfigJar|ConfigJar[];




}