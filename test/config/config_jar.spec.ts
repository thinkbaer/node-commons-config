
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {ConfigReader} from "../../src/config/ConfigReader";


//import * as config from 'config';



@suite('ConfigJar')
class ConfigJarTests {


    @test
    'default initialization' (){
        ConfigReader.reset()

        let jar = new ConfigJar()
        console.log(jar)

        let supportedTypes = ConfigReader.getSupportedTypes()
        expect(supportedTypes,'xml reader doesn\'t exists').to.contain('xml')
        expect(supportedTypes,'json reader doesn\'t exists').to.contain('json')


    }

}