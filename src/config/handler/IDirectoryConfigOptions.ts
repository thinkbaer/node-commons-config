import {IConfigOptions} from "../IConfigOptions";
import {IFilePath} from "./IFilePath";
import {NamingResolvePattern} from "../../types";

export interface IDirectoryConfigOptions extends IConfigOptions {

    /**
     * Directory path where the config files are found and loaded from.
     */
    dirname: string

    /**
     * Defines like namespaces should be generated from filepath
     *
     * - by_dirname - means that data from files in the directory will be merged
     *                in the config jar with directory name namespace
     *                example: path/to/file.js => path.to
     *
     * - by_filename - means that data from files in the directory will be merged
     *                 in separate config jars with filename as their namespace
     *                 example: path/to/file.js => path.to.file
     *
     * - none - means that data from all files will be merge in one jar with given namespace
     *
     */
    namespaceing?: NamingResolvePattern

    /**
     * Separator for binding multiple namespaces
     */
    namespaceSeparator?: string

    /**
     * Defines how the content from files should be prefixed or not
     *
     * - by_directory
     * - by_filename
     * - full
     * - none
     */
    prefixing?: NamingResolvePattern

    /**
     * Separator by which a filename will be identified
     */
    patternSeparator?: string

    /**
     * Pattern for exclude directories or files
     */
    exclude?: string[]

    /**
     * Patterns for file combinations
     */
    suffixPattern?: string[]
}