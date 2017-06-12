


import {IConfigOptions} from "./IConfigOptions";
export interface IOptions {
    /**
     * Root configuration directory
     */
    dir?:string

    /**
     * Basename of root configuration name
     */
    basename?:string

    /**
     * Directories with implementiations of IConfigReader
     */
    readerDirs?:string[],

    /**
     * Directories with implementiations of IConfigReader
     */
    fileSupportsDirs?:string[],

    /**
     * Enable interpolation support
     */
    interpolate?:boolean


    /**
     *  Configurations
     */
    configs?: IConfigOptions[]
}