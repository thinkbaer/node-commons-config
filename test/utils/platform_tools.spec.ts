
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {FileSupport} from "../../src/filesupport/FileSupport";
import {Utils} from "../../src/utils/Utils";
import {ConfigUtils} from "../../src/utils/ConfigUtils";
import {PlatformTools} from "../../src/utils/PlatformTools";


//import * as config from 'config';



@suite('utils/PlatformTools')
class PlatformToolsTests {

    @test
    'tests' () {
        let path = '/tmp/testfile.html';
        let normPath = PlatformTools.pathNormilize(path);
        expect(path).to.eq(normPath);

        let path2 = '/tmp/test/../testfile.html';
        normPath = PlatformTools.pathNormilize(path2);
        expect(path).to.eq(normPath);

        let basename = PlatformTools.basename(path);
        let filename = PlatformTools.filename(path);
        let ext = PlatformTools.pathExtname(path);
        expect(basename).to.eq(filename + '' + ext);

        ext = PlatformTools.pathExtname(filename);
        expect(ext).to.eq('');

        let path3 = '/tmp/test/../testfile';
        filename = PlatformTools.filename(path3);
        expect(filename).to.eq('testfile');

        let path4 = './test/testfile.html';
        normPath = PlatformTools.pathResolve(path4);

        expect(normPath).to.eq(PlatformTools.pathNormilize(__dirname+'/../../test/testfile.html'))

    }


}