import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ClassLoader} from "../../src/utils/ClassLoader";
import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";


//import * as config from 'config';


@suite('utils/Classloader')
class ClassLoaderTests {

    @test
    'import classes from any'() {
        let res = ClassLoader.importClassesFromAny(
            [__dirname + '/../../src/filesupport/types/JsonFileSupport.ts'])
        expect(res.length).to.be.eq(1)


        res = ClassLoader.importClassesFromAny(
            [__dirname + '/../../src/filesupport/types/*.ts'])
        expect(res.length).to.not.eq(0)

        res = ClassLoader.importClassesFromAny(
            [JsonFileSupport])
        expect(res.length).to.not.eq(0)
    }


}