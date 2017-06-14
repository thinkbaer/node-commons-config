
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {FileSupport} from "../../src/filesupport/FileSupport";
import {Config} from "../../src/config/Config";
import {Utils} from "../../src/utils/Utils";


//import * as config from 'config';



@suite('config/ConfigJar')
class ConfigJarTests {


    static before(){
        FileSupport.reload()
    }

    before(){
        // cleanup jars
        Config['$jars'] = {}
    }

    @test
    'functional' (){
        let data = {x:1,y:{y1:'test',y2:3},z:['x=${x}',2,3]}
        let clone = Utils.clone(data)

        // construct
        let jar = new ConfigJar()
        expect(jar['_options']['namespace']).to.eq('default')
        expect(jar.namespace).to.eq('default')


        // merge
        jar.merge(data)
        expect(jar.data).to.deep.eq(clone)

        // set
        let done = jar.set('x',2)
        expect(done).to.be.true
        expect(jar.get('x')).to.eq(2)
    }

    @test
    'interpolation support' (){
        let data = {x:1,y:{y1:'test',y2:3},z:['x=${x}',2,3]}

        // disabled interpolation
        let jar = new ConfigJar({interpolate:false})
        jar.merge(data)
        expect(jar.get('z.0')).to.eq('x=${x}')

        // manually exec interpolation
        jar.runInterpolation()
        expect(jar.get('z.0')).to.eq('x=1')

        // enabled
        jar = new ConfigJar({interpolate:true})
        jar.merge(data)
        expect(jar.get('z.0')).to.eq('x=1')
    }


}