
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {Utils} from "../../src/utils/Utils";
import {Config} from "../../src/config/Config";



//import * as config from 'config';



@suite('config/Config')
class ConfigTests {



    @test
    'default initialization' (){



        Config.load()

    }

}