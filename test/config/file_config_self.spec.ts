import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";

import {IConfigData} from "../../src/config/IConfigData";
import {FileSupport} from "../../src/filesupport/FileSupport";

import {IFileConfigOptions} from "../../src/config/handler/IFileConfigOptions";
import {Config} from "../../src/config/Config";
import {SystemConfig} from "../../src/config/handler/SystemConfig";
import {FileConfig} from "../../src/config/handler/FileConfig";
import {ConfigJar} from "../../src/config/ConfigJar";
import {inspect} from "util";



const SUBTESTPATH:string = 'testfolders/file/config'

@suite('config/handler/FileConfig load independently')
class FileConfigTests {



    @test
    'pattern'() {
        Config['$self'] = null
        let system = new SystemConfig() // ConfigHandler.getHandlerByType('system')
        let systemJar = <ConfigJar>system.create()

        systemJar.merge({os: {hostname: 'testhost'}, env: {stage: 'testing'}})

        let test: IConfigData = {
            pattern: [
                'default-${os.hostname}',
            ]
        }

        systemJar.interpolateAgainst(test)
        expect(test.pattern[0]).to.eq('default-testhost')

        test = {
            pattern: [
                'default-${os.hostname}',
                'default-${env.stage}',
                'default-${os.hostname}-${env.stage}',
            ]
        }

        systemJar.interpolateAgainst(test)
        expect(test.pattern[0]).to.eq('default-testhost')
        expect(test.pattern[1]).to.eq('default-testing')
        expect(test.pattern[2]).to.eq('default-testhost-testing')

    }


    @test
    'file input formats'() {
        FileSupport.reload()
        Config['$self'] = null
        let system = new SystemConfig() // ConfigHandler.getHandlerByType('system')
        let systemJar = <ConfigJar>system.create()
        systemJar.merge({os: {hostname: 'testhost'}, env: {stage: 'testing'}})


        let cfg = new FileConfig(<IFileConfigOptions>{
            file: __dirname + `/../${SUBTESTPATH}/default.json`
        },[systemJar.data])

        // Direct file name
        let jar = cfg.create()
        expect(jar.get('hallo')).to.eq('welt')

        // Normalize
        cfg = new FileConfig(<IFileConfigOptions>{
            file: {
                dirname: __dirname + `/../${SUBTESTPATH}/test/..`,
                filename: 'default'
            }
        },[systemJar.data])
        jar = cfg.create()
        expect(jar.get('hallo')).to.eq('welt')

        // Normalize and resolve
        cfg = new FileConfig(<IFileConfigOptions>{
            file: {
                dirname: `./test/${SUBTESTPATH}`,
                filename: 'default'
            }
        },[systemJar.data])
        jar = cfg.create()
        expect(jar.get('hallo')).to.eq('welt')

        // use patterns
        cfg = new FileConfig(<IFileConfigOptions>{
            file: {
                dirname: `./test/${SUBTESTPATH}`,
                filename: 'default'
            },
            pattern: [
                'default-${env.stage}',
                'default-${os.hostname}',
                'default-${os.hostname}-${env.stage}',

            ]
        },[systemJar.data])
        jar = cfg.create()
        expect(jar.get('hallo')).to.eq('welt2')
        expect(jar.get('p_testing')).to.be.true
        expect(jar.get('p_testhost')).to.be.true
        expect(jar.get('p_testhost_testing')).to.be.true

    }

}