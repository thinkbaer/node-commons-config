import {ConfigJar} from "../config/ConfigJar";
import {IConfigData} from "../config/IConfigData";
import {Utils} from "../utils/Utils";

const REGEX = /\${[^}]+}/g


export class InterpolationSupport {

    exec(data: IConfigData): void {
        Utils.walk(data, (x: any) => {
            let v = x.value
            if (typeof v === 'string' && REGEX.test(v)) {
                let match = v.match(REGEX);
                match.forEach(_match => {
                    let path = _match.replace(/^\${|}$/g,'')
                    let _value = Utils.get(data,path)
                    if(_value){
                        x.parent[x.key] = v.replace(_match,_value)
                    }else{
                        throw new Error('value not found for match '+_match + ' path='+path)
                    }
                })
            }
        })
    }


    afterMergeAsync(config: ConfigJar): void {
        //    config.
    }

}