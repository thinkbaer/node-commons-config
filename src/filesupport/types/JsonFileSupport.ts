
import {IConfigData} from "../../config/IConfigData";
import {IFileSupport} from "../IFileSupport";



export class JsonFileSupport implements IFileSupport{

    supportedTypes(): string | string[] {
        return 'json';
    }

    parse(content:string):IConfigData{
        let rawConfig : IConfigData = JSON.parse(content);
        return rawConfig;
    }

}