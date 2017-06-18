import * as mocha from 'mocha';
describe('', () => {})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {InterpolationSupport} from "../../src/supports/InterpolationSupport";
import {IConfigData} from "../../src/config/IConfigData";
import {Utils} from "../../src/utils/Utils";
import {Config} from "../../src/config/Config";


@suite('supports/InterpolationSupports')
class ConfigInterpolationTests {


    @test
    'config support interpolation'() {
        process.argv.push('--configfile', __dirname + '/../testfolders/files/file/config/default.json')
        Config['$self'] = null
        Config.options({
            configs: [
                {type: 'file', file: '${argv.configfile}'}
            ]
        })

        expect(Config.get('hallo')).to.eq('welt')

    }

}