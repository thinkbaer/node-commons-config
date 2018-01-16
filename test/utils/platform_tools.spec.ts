
import * as mocha from 'mocha';
describe('',()=>{});


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {PlatformUtils} from "commons-base";


//import * as config from 'config';



@suite('utils/PlatformUtils')
class PlatformUtilsTests {

    @test
    'tests' () {
        let path = '/tmp/testfile.html';
        let normPath = PlatformUtils.pathNormilize(path);
        expect(path).to.eq(normPath);

        let path2 = '/tmp/test/../testfile.html';
        normPath = PlatformUtils.pathNormilize(path2);
        expect(path).to.eq(normPath);

        let basename = PlatformUtils.basename(path);
        let filename = PlatformUtils.filename(path);
        let ext = PlatformUtils.pathExtname(path);
        expect(basename).to.eq(filename + '' + ext);

        ext = PlatformUtils.pathExtname(filename);
        expect(ext).to.eq('');

        let path3 = '/tmp/test/../testfile';
        filename = PlatformUtils.filename(path3);
        expect(filename).to.eq('testfile');

        let path4 = './test/testfile.html';
        normPath = PlatformUtils.pathResolve(path4);

        expect(normPath).to.eq(PlatformUtils.pathNormilize(__dirname+'/../../test/testfile.html'))

    }


}
