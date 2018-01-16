import {IConfigData} from "../../config/IConfigData";
import {IFileSupport} from "../IFileSupport";
import {clone} from "lodash"
import {PlatformUtils} from "commons-base";

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
        Prop = PlatformUtils.load('properties');
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
