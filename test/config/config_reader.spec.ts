
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigReader} from "../../src/config/ConfigReader";
import {JsonConfigReader} from "../../src/reader/JsonConfigReader";


//import * as config from 'config';



@suite('ConfigReader')
class ConfigReaderTests {


    @test
    'load predefined config reader' (){
        let res = ConfigReader.reload(__dirname+'/../../src/reader/*.ts')
        expect(res,'reloading of readers failed').to.be.true

        let supportedTypes = ConfigReader.getSupportedTypes()
        expect(supportedTypes,'xml reader doesn\'t exists').to.contain('xml')
        expect(supportedTypes,'json reader doesn\'t exists').to.contain('json')

        let readerCount = ConfigReader.amount()
        expect(readerCount,'no reader found').to.greaterThan(0)
    }

    @test
    'get reader for special type' (){
        let res = ConfigReader.reload(__dirname+'/../../src/reader/*.ts')
        expect(res,'reloading of readers failed').to.be.true

        let reader = ConfigReader.getReaderForExtension('json')
        expect(reader,'loading of reader failed').to.exist
        expect(reader instanceof JsonConfigReader,'loading of json config reader failed').to.be.true

        let json = reader.parse('{"hallo":"welt"}')
        expect(json,'json not correctly parsed').to.be.deep.eq({hallo:'welt'})
    }
}