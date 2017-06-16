import * as fs from 'fs';

import {IConfigSupport} from "../IConfigSupport";
import {ConfigJar} from "../ConfigJar";
import {IFileConfigOptions} from "./IFileConfigOptions";
import {FileSupport} from "../../filesupport/FileSupport";
import {PlatformTools} from "../../utils/PlatformTools";
import {IConfigData} from "../IConfigData";

import {Config} from "../Config";

import {IFilePath} from "./IFilePath";
import {FileSource} from "./FileSource";
import {SystemConfig} from "./";



/**
 * Read configuration from file
 */
export class FileConfig implements IConfigSupport {


    type() {
        return 'file'
    }


    private readFile(file:IFilePath):IConfigData{
        let supportedTypes = FileSupport.getSupportedTypes()
        let used_path = null
        let used_ext = null
        while (!used_ext && supportedTypes.length > 0) {
            let ext = supportedTypes.shift()
            used_path = file.dirname + '/' + file.filename + '.' + ext
            if (PlatformTools.fileExist(used_path)) {
                used_ext = ext
            }
        }

        if (!used_ext || !used_path) {
            return null
        }

        file.type = used_ext
        let supportInfo = FileSupport.getInfoByExtension(used_ext)
        if (!supportInfo.enabled) {
            throw new Error(`${used_ext} support not enabled`)
        }

        let support = FileSupport.getSupportByExtension(used_ext)
        let content: any = null
        let data: IConfigData = null

        if (supportInfo.readable) {
            data = support.read(used_path)
        } else if (supportInfo.parseable) {
            content = fs.readFileSync(used_path, 'UTF-8')
            data = support.parse(content)
        } else {
            throw new Error('is not readable or parseable')
        }
        return data

    }

    private readFiles(paths:IFilePath[]): FileSource[] {
        let self = this
        let collection:FileSource[] = []

        paths.forEach((path, index) => {
            let data = self.readFile(path)
            if(!data && index === 0){
                // TODO make this configurable
                throw new Error('base file doesn\'t exists')
            }else if(data){
                let source = new FileSource({data:data, file:path})
                collection.push(source)
            }
        })

        return collection;
    }

    private explodeFilePath(path:string|IFilePath):IFilePath{
        let file: IFilePath = null;
        if (typeof path === 'string') {
            let filepath = PlatformTools.pathNormilize(PlatformTools.pathResolve(path))
            file = {
                dirname: PlatformTools.dirname(filepath),
                filename: PlatformTools.filename(filepath),
                type: PlatformTools.pathExtname(filepath),
            }
        } else {
            file = path
            file.dirname = PlatformTools.pathNormilize(PlatformTools.pathResolve(file.dirname))
            // TODO check if extension is falsely set in filename
        }
        return file
    }


    private attachPatternFiles(basefile:IFilePath, options?: IFileConfigOptions): IFilePath[]{

        let files: IFilePath[] = []
        if(options.pattern){
            let self = this

            // if not globally definied then load directly
            if(!Config.hasJar('system')){
                let system  = new SystemConfig()
                let systemJar = system.create()
                systemJar.interpolateAgainst(options)
            }else{
                Config.jar('system').interpolateAgainst(options)
            }

            options.pattern.forEach(pattern => {
                // TODO works only in posix systems!
                let subfile : IFilePath = null;
                if(/^\.?\//.test(pattern)){
                    // full or app relative path given!
                    subfile = self.explodeFilePath(pattern)
                }else{
                    subfile = self.explodeFilePath(basefile.dirname+'/'+pattern)
                }
                files.push(subfile)
            })
        }

        return files
    }


    create(options?: IFileConfigOptions): ConfigJar {
        let files: IFilePath[] = []
        let basefile = this.explodeFilePath(options.file)
        files.push(basefile)

        let additional_files = this.attachPatternFiles(basefile,options)
        if(additional_files.length){
            files = files.concat(additional_files)
        }

        let sources = this.readFiles(files)
        let jar = ConfigJar.create({namespace: options.namespace})

        sources.forEach(_source => {
            jar.merge(_source)
        })
        return jar
    }


}
