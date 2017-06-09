// import {merge, mergeDeep} from "typescript-object-utils";
import * as merge from 'deepmerge'

export class Utils {

    /**
     * https://stackoverflow.com/questions/1960473/unique-values-in-an-array
     * @param arr
     * @returns {any[]}
     */
    static unique_array(arr: any[]): any[] {
        return arr.filter((v, i, a) => a.indexOf(v) === i);
    }


    static merge(...args: any[]): any {
        return merge.all(args)
        /*
         let tmp:any={}
         args.forEach(_x => {tmp = mergeDeep(tmp,_x)})
         return tmp
         */
    }

    static walk(root: any, fn: Function) {
        function walk(obj: any, location: any[] = []) {

            Object.keys(obj).forEach((key) => {

                // Value is an array, call walk on each item in the array
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((el:any, j:number) => {
                        fn({
                            value: el,
                            key: `${key}:${j}`,
                            index: j,
                            location: [...location, ...[key], ...[j]],
                            parent:obj,
                            isLeaf: false
                        })
                        walk(el, [...location, ...[key], ...[j]])
                    })

                    // Value is an object, walk the keys of the object
                } else if (typeof obj[key] === 'object') {
                    fn({
                        value: obj[key],
                        key: key,
                        parent: obj,
                        index:null,
                        location: [...location, ...[key]],
                        isLeaf: false
                    })
                    walk(obj[key], [...location, ...[key]])

                    // We've reached a leaf node, call fn on the leaf with the location
                } else {
                    fn({
                        value: obj[key],
                        key:key,
                        parent:obj,
                        index:null,
                        location: [...location, ...[key]],
                        isLeaf: true
                    })
                }
            })
        }

        walk(root)
    }

    static get(arr:any, path:string = null):any{
        if(path){
            let paths = path.split('.')
            let first:string|number = paths.shift()
            if(/\d+/.test(first)){
                first = parseInt(first)
            }
            if(arr.hasOwnProperty(first)){
                let pointer:any = arr[first]

                return Utils.get(pointer,paths.join('.'))
            }else{
                // not found
                return null
            }

        }
        return arr

    }

}