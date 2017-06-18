


import {IConfigOptions} from "./IConfigOptions";
import {StringOrFunction} from "../types";




export interface IOptions {

    /**
     * Directories with implementiations of IConfigReader
     */
    handlers?: StringOrFunction[],

    /**
     * Directories|Files|Classes with implementiations of IFileSupport
     */
    fileSupport?:StringOrFunction[],

    /**
     * Enable interpolation support
     */
    interpolate?:boolean

    /**
     *  Configurations
     */
    configs?: IConfigOptions[]

    /**
     * Allow free key definitions
     */
    [k:string]:any
}