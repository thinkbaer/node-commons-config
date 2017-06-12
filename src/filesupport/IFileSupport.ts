

import {IConfigData} from "../config/IConfigData";
import {IOptions} from "../config/IOptions";
export interface IFileSupport {

    requirements?(done?:Function):void

    supportedTypes():string|string[];

    read?(path: string):IConfigData;

    parse?(content:string):IConfigData;

}