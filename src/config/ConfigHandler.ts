

import {IConfigSupport} from "./IConfigSupport";
import {StringOrFunction} from "../types";
import {ClassLoader} from "../utils/ClassLoader";
import {SystemConfig} from "./handler/SystemConfig";
import {FileConfig} from "./handler/FileConfig";


export const DEFAULT_HANDLER : StringOrFunction[] = [
    SystemConfig,
    FileConfig
]

export class ConfigHandler {

    private static $supports: {[k:string]:Function} = {};

    /**
     * Loades classes in *.js or *.ts files from given directories, verifing if they implement the
     * IConfigSupport interface.
     *
     * @param directories
     */
    static reload(directories: StringOrFunction | StringOrFunction[] = DEFAULT_HANDLER): boolean {
        this.reset()

        let self = this
        if (!Array.isArray(directories)) {
            directories = [directories]
        }
        let classes = ClassLoader.importClassesFromAny(directories);

        classes.forEach((klass: Function) => {

            let l : IConfigSupport = null
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
        return this.$supports.length
    }

    static getHandlerByType(ext: string): IConfigSupport {
        if(this.$supports[ext]){
            return Reflect.construct(this.$supports[ext], [])
        }
        return null
    }



    static reset(){
        this.$supports = {}
    }

}