
import {ConfigJar} from "./ConfigJar";
import {Config} from "./Config";
import {IConfigOptions} from "./IConfigOptions";

export abstract class ConfigSupport<T extends IConfigOptions> {

    $options:T;

    constructor(options : T) {
        this.$options = options

        // if not globally definied then load directly
        if (options.type != 'system' && Config.hasJar('system')) {
            Config.jar('system').interpolateAgainst(this.$options)
        }

    }

    abstract type() : string

    abstract create() : ConfigJar|ConfigJar[];




}