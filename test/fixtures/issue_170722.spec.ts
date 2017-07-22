import {suite, test} from "mocha-typescript";
import {expect} from "chai";

import {Config} from "../../src/config/Config";
import {Utils} from "../../src/utils/Utils";
import * as _ from 'lodash'

describe('', () => {
});


//import * as config from 'config';
const DEFAULT_CONFIG_LOAD_ORDER = [
    //{type: 'file', file: '${argv.configfile}'},
    //{type: 'file', file: '${env.configfile}'},
    {type: 'file', file: '${os.homedir}/.testdir/config.json'},
    {type: 'file', file: './testfile.json'},
]


@suite('fixtures')
class Tests {


    @test
    'multiple files pass directly to Config.options'() {
        Config.clear()
        let cfg = Utils.clone(DEFAULT_CONFIG_LOAD_ORDER)
        cfg.push({type: 'file', file: __dirname +'/issue_170722_testfile.yml'})
        let options = null
        try {
            options = Config.options(cfg)
        } catch (err) {
            //console.error(err)
            expect(err).to.be.null
        }
        let list = _.filter(options.configs,(x) => {return x.state === true && x.type === 'file'})

        expect(list).to.has.length(1)

        let data:any = Config.all()
        expect(data).to.has.length(2)
        data = data.pop()
        expect(data.rotator).to.be.null
        expect(data.logging.enable).to.be.true

    }

}