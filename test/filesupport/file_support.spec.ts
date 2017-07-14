
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {FileSupport} from "../../src/filesupport/FileSupport";
import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";



@suite('filesupport/FileSupport')
class FileSupportTests {

    @test
    'load predefined types' (){
        // Default
        let res = FileSupport.reload();
        expect(res,'reloading of readers failed').to.be.true;

        let supportedTypes = FileSupport.getSupportedTypes();
        expect(supportedTypes,'xml reader doesn\'t exists').to.contain('xml');
        expect(supportedTypes,'json reader doesn\'t exists').to.contain('json');

        let readerCount = FileSupport.amount();
        expect(readerCount,'no reader found').to.greaterThan(0)
    }


    @test
    'get type for special type' (){
        let res = FileSupport.reload(__dirname+'/../../src/filesupport/types/*.ts');
        expect(res,'reloading of readers failed').to.be.true;

        let reader = FileSupport.getSupportByExtension('json');
        expect(reader,'loading of reader failed').to.exist;
        expect(reader instanceof JsonFileSupport,'loading of json config reader failed').to.be.true;

        let json = reader.parse('{"hallo":"welt"}');
        expect(json,'json not correctly parsed').to.be.deep.eq({hallo:'welt'})
    }
}