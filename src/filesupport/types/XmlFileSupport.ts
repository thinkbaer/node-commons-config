

import {IConfigData} from "../../config/IConfigData";
import {PlatformTools} from "../../utils/PlatformTools";
import {IFileSupport} from "../IFileSupport";

let XML:any;

export class XmlFileSupport implements IFileSupport{

    requirements():void {
        PlatformTools.load('x2js')
    }

    supportedTypes(): string | string[] {
        return 'xml';
    }

    parse(content:string):IConfigData{
        if(!XML){
            XML = PlatformTools.load('x2js')
        }
        let x2js = new XML();
        let rawConfig : IConfigData = x2js.xml2js(content);
        let rootKeys = Object.keys(rawConfig);
        if(rootKeys.length == 1) {
            rawConfig = rawConfig[rootKeys[0]];
        }
        return rawConfig;
    }

}