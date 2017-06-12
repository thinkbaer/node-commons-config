
import {IConfigOptions} from "../IConfigOptions";

export interface IFilePath {
    /**
     * Directory path where filename
     */
    dirname?: string

    /**
     * Filename without extension
     */
    filename?: string

    /**
     * Typ of file (optional)
     */
    type?: string
}


export interface IFileConfigOptions extends IConfigOptions {

    /**
     * Direct path for file as a string or a combination dirname and basename
     */
    file: string|IFilePath

    /**
     * Patterns for file combinations
     */
    pattern?: string[]
}