import {IConfigOptions} from "./IConfigOptions";
import {ConfigReader} from "./ConfigReader";
import {IConfigSource} from "./IConfigSource";
import {IConfigData} from "./IConfigData";


const DEFAULT_OPTIONS: IConfigOptions = {
    readerDirs: [__dirname + '/../reader/*'],
    interpolate:true,
    basename: 'default',
    dir: 'config'
}

export class ConfigJar {

    private _options: IConfigOptions = DEFAULT_OPTIONS

    private _data: IConfigData = {}

    private _source: IConfigSource[]

    constructor(options: IConfigOptions = {}) {
        this.options(options)
    }

    loadFromFile(path: string) {

    }

    loadFromString(content: string, type:string = 'json',namespace:string=null) {
        let reader = ConfigReader.getReaderForExtension(type);
        let json = reader.parse(content);
    }

    private merge(data: IConfigData){

    }

    options(options: IConfigOptions) {
        if (options.readerDirs) {

            if (!this._options.readerDirs) {
                this._options.readerDirs = []
            }

            if (options.readerDirs instanceof Array) {
                this._options.readerDirs = this._options.readerDirs.concat(options.readerDirs)
            } else if (typeof options.readerDirs === 'string') {
                this._options.readerDirs.push(options.readerDirs)
            } else {
                throw new Error('Wrong type')
            }

            delete options.readerDirs
        }

        this._options = Object.assign(this._options, options)

        ConfigReader.reload(this._options.readerDirs)
    }

}