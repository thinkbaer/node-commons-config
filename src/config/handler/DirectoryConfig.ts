import {IConfigSupport} from "../IConfigSupport";
import {IDirectoryConfigOptions} from "./IDirectoryConfigOptions";
import {ConfigJar} from "../ConfigJar";


/**
 * Load config
 */
export class DirectoryConfig implements IConfigSupport {

    type() : string {
        return 'dir'
    }

    create(options? : IDirectoryConfigOptions) : ConfigJar {

        return null
    }

}
