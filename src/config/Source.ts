import {IConfigData} from "./IConfigData";
import {Utils} from "../utils/Utils";

export class Source  {

    source:string = 'none'

    data:IConfigData = null

    constructor(opts:any){
        Object.assign(this,opts)
    }
}