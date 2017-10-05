import {IConfigData} from "../../config/IConfigData";
import {PlatformTools} from "../../utils/PlatformTools";
import {IFileSupport} from "../IFileSupport";
import {clone} from "lodash"

let Prop:any;

const OPTIONS = {
    path: false,
    namespaces: true,
    sections: true,
    variables: true,
    include: false
}

export class PropertiesFileSupport implements IFileSupport {

    requirements(): void {
        Prop = PlatformTools.load('properties');
    }

    supportedTypes(): string | string[] {
        return ['conf', 'properties', 'ini'];
    }

    parse(content: string): IConfigData {
        let cfg : IConfigData = null;
        let opts = clone(OPTIONS)
        cfg = Prop.parse(content, opts);
        return cfg;
    }


}