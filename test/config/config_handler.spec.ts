import * as mocha from 'mocha';
describe('', () => {
});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";

import {ConfigHandler} from "../../src/config/ConfigHandler";



@suite('config/ConfigHandler')
class ConfigHandlerTests {


    @test
    'reloading handler'() {
        ConfigHandler.reload();
        expect(ConfigHandler.amount()).to.not.eq(0)

    }

}