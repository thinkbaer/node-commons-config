
import {ConfigJar} from "./ConfigJar";

export abstract class ConfigSupport<T> {

    $options:T;

    constructor(options : T) {
        this.$options = options
    }

    abstract type() : string

    abstract create() : ConfigJar|ConfigJar[];




}