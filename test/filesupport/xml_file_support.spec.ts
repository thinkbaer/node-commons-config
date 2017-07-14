
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {XmlFileSupport} from "../../src/filesupport/types/XmlFileSupport";



//import * as config from 'config';



@suite('filesupport/types/XmlFileSupport')
class XmlCfgReaderTests {


    @test
    'libaries must exist' (){
        let reader = new XmlFileSupport();
        reader.requirements()
    }

    @test
    'parse simple xml' (){
        let reader = new XmlFileSupport();
        reader.requirements();
        let data = reader.parse('<xml><hallo>welt</hallo></xml>');
        expect(data).to.deep.eq({hallo:'welt'})
    }

}