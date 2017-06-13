
import {IConfigOptions} from "../IConfigOptions";
import {IFilePath} from "./IFilePath";

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