import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {Config} from "../../src/config/Config";


//import * as config from 'config';


@suite('config/Config')
class ConfigTests {


    @test
    'default initialization'() {
        // load default
        Config['$self'] = null
        Config.options()
        expect(Config.instance()['$options'].configs[0].type).to.eq('system')

        Config['$self'] = null
        Config.options({configs: []})
        expect(Config.instance()['$options'].configs.length).to.eq(1)

        Config['$self'] = null
        Config.options({configs: []}, false)
        expect(Config.instance()['$options'].configs.length).to.eq(0)
        expect(Config.instance()['$options'].handlers.length).to.not.eq(0)
        expect(Config.instance()['$options'].fileSupport.length).to.not.eq(0)



    }

}