
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";

import {YamlFileSupport} from "../../src/filesupport/types/YamlFileSupport";





//import * as config from 'config';



@suite('filesupport/types/YamlFileSupport')
class YamlSupportTests {


    @test
    'libaries must exist' (){
        let reader = new YamlFileSupport();
        reader.requirements()
    }

    @test
    'supports types' (){
        let reader = new YamlFileSupport();
        let types = reader.supportedTypes();
        expect(Array.isArray(types)).to.be.true;
        expect(types).to.contain('yml');
        expect(types).to.contain('yaml')
    }

    @test
    'parse simple' (){
        let reader = new YamlFileSupport();
        let data = reader.parse('hallo: welt');
        expect(data).to.deep.eq({hallo:'welt'})
    }

}