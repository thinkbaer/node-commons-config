
import {Utils} from "../utils/Utils";
import {IFileSupportInfo} from "./IFileSupportInfo";
import {IFileSupport} from "./IFileSupport";

import {JsonFileSupport} from "./types/JsonFileSupport";
import {XmlFileSupport} from "./types/XmlFileSupport";
import {YamlFileSupport} from "./types/YamlFileSupport";
import {PropertiesFileSupport} from "./types/PropertiesFileSupport";
import {ClassLoader, StringOrFunction} from "commons-base";


/**
 * FileSupport
 */
export class FileSupport {
    static DEFAULT_TYPES: StringOrFunction[] = [
        JsonFileSupport,
        YamlFileSupport,
        XmlFileSupport,
        PropertiesFileSupport
    ];

    private static $supports: IFileSupportInfo[] = [];

    /**
     * Loades classes in *.js or *.ts files from given directories, verifing if they implement the
     * IConfigReader interface. For each valid class an info entry is created and added to $reader
     *
     * @param directories
     */
    static reload(directories: StringOrFunction | StringOrFunction[] = FileSupport.DEFAULT_TYPES): boolean {
        this.reset();

        if (!Array.isArray(directories)) {
            directories = [directories]
        }
        let classes = ClassLoader.importClassesFromAny(directories);

        classes.forEach((klass: Function) => {

            let info: IFileSupportInfo = {
                klass: klass,
                ext: [],
                enabled: false,
                parseable: false,
                readable: false,
            };

            let l: any = {};
            try {
                l = Reflect.construct(klass, [])
            } catch (err) {
                console.error(err);
                return;
            }

            if (l.supportedTypes !== undefined) {
                let types = l.supportedTypes();
                if (typeof types === 'string') {
                    info.ext = [types]
                } else {
                    info.ext = types
                }
            } else {
                return;
            }

            if (l.requirements !== undefined) {
                try {
                    l.requirements();
                    info.enabled = true
                } catch (e) {
		    // TODO use logger (passthrough logger)
                    // console.log('WARNING: executing requirements for ' + l + ' failed, this types cannot be loaded')
                }
            } else {
                info.enabled = true
            }

            info.readable = l.read !== undefined;
            info.parseable = l.parse !== undefined;
            FileSupport.$supports.unshift(info)
        });

        return FileSupport.$supports.length > 0
    }

    static getSupportedTypes(force_all: boolean = false): string[] {
        let types: string[] = [];
        FileSupport.$supports.forEach((_x) => {
            if (_x.enabled || force_all) {
                types = types.concat(_x.ext)
            }
        });
        return Utils.unique_array(types)
    }

    static amount() {
        return FileSupport.$supports.length
    }

    static getInfoByExtension(ext: string): IFileSupportInfo {
        for (let i = 0; i < FileSupport.$supports.length; i++) {
            if (FileSupport.$supports[i].ext.indexOf(ext) > -1) {
                return FileSupport.$supports[i]
            }
        }
        return null
    }

    static getSupportByExtension(ext: string): IFileSupport {
        let info = FileSupport.getInfoByExtension(ext);
        if (info) {
            return Reflect.construct(info.klass, [])
        }
        return null
    }


    static reset() {
        FileSupport.$supports = []
    }


}
