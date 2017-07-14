
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";

import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";
import {FileSupport} from "../../src/filesupport/FileSupport";




@suite('filesupport/FileSupport')
class FileSupportTests {

    @test
    'load predefined types' (){
        // Default
        let test = new JsonFileSupport();
        let res = FileSupport.reload()
    }


}