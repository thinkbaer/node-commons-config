
import {IConfigReader} from "../config/IConfigReader";
import {IConfigData} from "../config/IConfigData";
import {PlatformTools} from "../utils/PlatformTools";

let XML:any;

export class JsonConfigReader implements IConfigReader{

    supportedTypes(): string | string[] {
        return 'json';
    }

    parse(content:string):IConfigData{
        let rawConfig : IConfigData = JSON.parse(content);
        return rawConfig;
    }

}