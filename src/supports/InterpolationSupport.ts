import {ConfigJar} from "../config/ConfigJar";
import {IConfigData} from "../config/IConfigData";
import {Utils} from "../utils/Utils";

const REGEX = /\${[^}]+}/g;


export class InterpolationSupport {

    // private lookup

    static exec(data: IConfigData, ...lookup: any[]): void {

        if (!lookup.length) {
            lookup = [data]
        }else{
            if(Array.isArray(lookup[0])){
                lookup = lookup[0]
            }
        }

        Utils.walk(data, (x: any) => {
            let v = x.value;
            if (typeof v === 'string' && REGEX.test(v)) {
                let match = v.match(REGEX);
                match.forEach(_match => {
                    let path = _match.replace(/^\${|}$/g, '');
                    let _value = null;

                    for(let i=0;i<lookup.length;i++){
                        _value = Utils.get(lookup[i], path);
                        if(_value) break;
                    }


                    if (_value) {

                        if (x.index !== null) {
                            x.parent[x.key][x.index] = v = v.replace(_match, _value)
                        } else {
                            x.parent[x.key] = v = v.replace(_match, _value)
                        }
                    } else {
                        // not found ignore replacement!
                        // throw new Error('value not found for match ' + _match + ' path=' + path)
                    }
                })
            }
        })

    }

}