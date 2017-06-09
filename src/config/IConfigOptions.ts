

export interface IConfigOptions {
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
     * Enable interpolation support
     */
    interpolate?:boolean

}