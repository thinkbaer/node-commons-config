


import {IFilePath} from "./IFilePath";
import {Source} from "../Source";


export class FileSource extends Source{

    file:IFilePath


    constructor(opts:any){
        super({...opts,source:'file'})
    }

}