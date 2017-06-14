

import {IConfigData} from "./IConfigData";
import {IOptions} from "./IOptions";
import {ConfigJar} from "./ConfigJar";
import {IConfigOptions} from "./IConfigOptions";

export interface IConfigSupport {

    type() : string

    create(options? : IConfigOptions) : ConfigJar;

}