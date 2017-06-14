import {IConfigData} from "../../config/IConfigData";
import {PlatformTools} from "../../utils/PlatformTools";
import {IFileSupport} from "../IFileSupport";

let Yaml:any, VisionmediaYaml:any;

export class YamlFileSupport implements IFileSupport {

    requirements(): void {
        try {
            Yaml = PlatformTools.load('js-yaml');
        }
        catch (e) {
            VisionmediaYaml = PlatformTools.load('yaml');
        }
    }

    supportedTypes(): string | string[] {
        return ['yml', 'yaml'];
    }

    parse(content: string): IConfigData {
        let cfg : IConfigData = null
        if (Yaml) {
            cfg = Yaml.load(content);
        }
        else if (VisionmediaYaml) {
            // The yaml library doesn't like strings that have newlines but don't
            // end in a newline: https://github.com/visionmedia/js-yaml/issues/issue/13
            content += '\n';
            cfg = VisionmediaYaml.eval(YamlFileSupport.stripYamlComments(content));
        }
        else {
            console.error("No YAML parser loaded.  Suggest adding js-yaml dependency to your package.json file.")
        }

        return cfg;
    }

    private static stripYamlComments (fileStr:string) {
        // First replace removes comment-only lines
        // Second replace removes blank lines
        return fileStr.replace(/^\s*#.*/mg,'').replace(/^\s*[\n|\r]+/mg,'');
    }

}