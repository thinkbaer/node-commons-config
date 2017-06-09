

import {IConfigData} from "./IConfigData";
export interface IConfigReader {

    requirements?(done?:Function):void

    supportedTypes():string|string[];

    read?(path: string):IConfigData;

    parse?(content:string):IConfigData;

}