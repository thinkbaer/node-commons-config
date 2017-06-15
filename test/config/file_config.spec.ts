import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";

import {FileConfig} from "../../src/config/handler/FileConfig";
import {SystemConfig} from "../../src/config/handler/SystemConfig";
import {IConfigData} from "../../src/config/IConfigData";
import {FileSupport} from "../../src/filesupport/FileSupport";


@suite('config/handler/FileConfig')
class FileConfigTests {


    static before() {
        FileSupport.reload()
    }


    @test
    'pattern'() {
        let system = new SystemConfig()
        let systemJar = system.create({})
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
        let cfg = new FileConfig()

        // Direct file name
        let jar = cfg.create({
            file: __dirname + '/testfolder_file/config/default.json'
        })
        expect(jar.get('hallo')).to.eq('welt')

        // Normalize
        jar = cfg.create({
            file: {
                dirname: __dirname + '/testfolder_file/config/test/..',
                filename: 'default'
            }
        })
        expect(jar.get('hallo')).to.eq('welt')

        // Normalize and resolve
        jar = cfg.create({
            file: {
                dirname: './test/config/testfolder_file/config',
                filename: 'default'
            }
        })
        expect(jar.get('hallo')).to.eq('welt')

        // use patterns
        jar = cfg.create({
            file: {
                dirname: './test/config/testfolder_file/config',
                filename: 'default'
            },
            pattern: [
                'default-${env.stage}',
                'default-${os.hostname}',
                'default-${os.hostname}-${env.stage}',

            ]
        })

        expect(jar.get('hallo')).to.eq('welt2')
        expect(jar.get('p_testing')).to.be.true
        expect(jar.get('p_testhost')).to.be.true
        expect(jar.get('p_testhost_testing')).to.be.true

    }

}