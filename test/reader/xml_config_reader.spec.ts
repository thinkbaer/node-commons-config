
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {XmlConfigReader} from "../../src/reader/XmlConfigReader";

//import * as config from 'config';



@suite('Xml config reader')
class XmlCfgReaderTests {


    @test
    'libaries must exist' (){
        let reader = new XmlConfigReader()
        reader.requirements()

    }
}