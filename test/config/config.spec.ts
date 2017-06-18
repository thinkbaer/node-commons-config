import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import * as os from 'os'
import {inspect} from 'util'
import {Config} from "../../src/config/Config";
import {ConfigJar} from "../../src/config/ConfigJar";
import {IConfigData} from "../../src/config/IConfigData";


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
        let instance = Config.instance()
        expect(instance['$options'].configs.length).to.eq(0)
        expect(instance['$options'].handlers.length).to.not.eq(0)
        expect(instance['$options'].fileSupport.length).to.not.eq(0)
    }


    @test
    'functional'() {
        Config['$self'] = null

        let inst = Config.instance()
        expect(inst['$options'].configs.length).to.eq(1)
        expect(inst['$options'].configs[0].type).to.eq('system')

        expect(Config.hasJar('system')).to.be.true
        expect(Config.hasJar('default')).to.be.false

        expect(inst['$jars']['system']['_source'][0]['source']).to.eq('os')
        expect(inst['$jars']['system']['_source'][1]['source']).to.eq('env')
        expect(inst['$jars']['system']['_source'][2]['source']).to.eq('argv')

        // test method jars
        let jars: ConfigJar[] = Config.jars
        expect(jars.length).to.eq(1)
        expect(jars[0].namespace).to.eq('system')

        // test method jarsData
        let jarsData: IConfigData[] = Config.jarsData
        expect(jarsData.length).to.eq(1)
        expect(jarsData[0]['os']['hostname']).to.eq(os.hostname())

        // test method get
        expect(Config.get('os').hostname).to.eq(os.hostname())
        expect(Config.get('os.hostname')).to.eq(os.hostname())
        expect(Config.get('os.hostname', 'system')).to.eq(os.hostname())

        // test method set
        expect(Config.set('env.hallo', 'welt', 'system')).to.be.true
        expect(Config.get('env.hallo')).to.eq('welt')

        expect(Config.set('env.hallo_welt', 'ja')).to.be.true
        expect(Config.get('env.hallo_welt')).to.eq('ja')

        expect(Config.hasJar('default')).to.be.true
    }

    @test
    'combination'() {

    }
}