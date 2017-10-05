
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";
import {PropertiesFileSupport} from "../../src/filesupport/types/PropertiesFileSupport";

//import * as config from 'config';



@suite('filesupport/types/PropertiesFileSupport')
class PropertiesSupportTests {

    @test
    'libaries must exist' (){
        let reader = new PropertiesFileSupport();
        reader.requirements()
    }

    @test
    'supports types' (){
        let reader = new PropertiesFileSupport();
        let types = reader.supportedTypes();
        expect(Array.isArray(types)).to.be.true;
        expect(types).to.contain('conf');
        expect(types).to.contain('properties');
        expect(types).to.contain('ini');
    }


    @test
    'parse simple json' (){
        let reader = new PropertiesFileSupport();

        let data = reader.parse('hallo=welt');
        expect(data).to.deep.eq({hallo:'welt'});

        data = reader.parse('[db]\nhallo=welt');
        expect(data).to.deep.eq({db: {hallo:'welt'}});
    }

}