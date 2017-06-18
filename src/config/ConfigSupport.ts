
import {ConfigJar} from "./ConfigJar";
import {IConfigData} from "./IConfigData";
import {InterpolationSupport} from "../supports/InterpolationSupport";



export abstract class ConfigSupport<T> {

    $options:T;

    constructor(options : T, jarsData:IConfigData[]=[]) {
        this.$options = options

        // if not globally definied then load directly
        if (options && options['type'] != 'system' && jarsData && jarsData.length > 0) {
            InterpolationSupport.exec(this.$options, jarsData)
        }

    }

    abstract type() : string

    abstract create() : ConfigJar|ConfigJar[];




}