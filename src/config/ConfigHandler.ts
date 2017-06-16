import {ClassLoader} from "../utils/ClassLoader";


import {StringOrFunction} from "../types";

import {SystemConfig} from "./handler/SystemConfig";
import {FileConfig} from "./handler/FileConfig";
import {ConfigSupport} from "./ConfigSupport";
import {IConfigOptions} from "./IConfigOptions";


export class ConfigHandler {

    static DEFAULT_HANDLER: StringOrFunction[] = [
        SystemConfig,
        FileConfig
    ]


    private static $supports: { [k: string]: Function } = {};

    /**
     * Loades classes in *.js or *.ts files from given directories, verifing if they implement the
     * IConfigSupport interface.
     *
     * @param directories
     */
    static reload(directories: StringOrFunction | StringOrFunction[] = this.DEFAULT_HANDLER): boolean {
        this.reset()

        let self = this
        if (!Array.isArray(directories)) {
            directories = [directories]
        }
        let classes = ClassLoader.importClassesFromAny(directories);

        classes.forEach((klass: Function) => {

            let l: any = null
            try {
                l = Reflect.construct(klass, [])
            } catch (err) {
                console.error(err)
                return;
            }

            self.$supports[l.type()] = klass

        })

        return Object.keys(this.$supports).length > 0
    }

    static getHandlerTypes(): string[] {
        return Object.keys(this.$supports)
    }

    static amount() {
        return Object.keys(this.$supports).length
    }

    static getHandlerByType(ext: string, opts:IConfigOptions): ConfigSupport<any> {
        if (this.$supports[ext]) {
            return Reflect.construct(this.$supports[ext], [opts])
        }
        return null
    }


    static reset() {
        this.$supports = {}
    }

}