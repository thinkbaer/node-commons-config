
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {XmlFileSupport} from "../../src/filetypes/XmlFileSupport";
import {JsonFileSupport} from "../../src/filetypes/JsonFileSupport";


//import * as config from 'config';



@suite('filetypes/JsonFileSupport')
class JsonSupportTests {



    @test
    'parse simple json' (){
        let reader = new JsonFileSupport()
        let data = reader.parse('{"hallo":"welt"}')
        expect(data).to.deep.eq({hallo:'welt'})
    }

}