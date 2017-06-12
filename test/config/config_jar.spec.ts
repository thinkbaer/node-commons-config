
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {FileSupport} from "../../src/filesupport/FileSupport";


//import * as config from 'config';



@suite('ConfigJar')
class ConfigJarTests {


    @test
    'default initialization' (){
        FileSupport.reset()

        let jar = new ConfigJar()
        console.log(jar)

        let supportedTypes = FileSupport.getSupportedTypes()
        expect(supportedTypes,'xml reader doesn\'t exists').to.contain('xml')
        expect(supportedTypes,'json reader doesn\'t exists').to.contain('json')

    }



}