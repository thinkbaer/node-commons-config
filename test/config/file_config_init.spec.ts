import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";

import {FileConfig} from "../../src/config/handler/FileConfig";
import {SystemConfig} from "../../src/config/handler/SystemConfig";
import {IConfigData} from "../../src/config/IConfigData";
import {Config} from "../../src/config/Config";
import {IFileConfigOptions} from "../../src/config/handler/IFileConfigOptions";
import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";


@suite('config/Config with file options')
class FileConfigTests {


    @test
    'config by options'() {
        // config
        Config['$self'] = null
        Config.options({
            configs: [
                <IFileConfigOptions>{
                    type: 'file',
                    file: './test/config/testfolder_file/config/default.json'
                }
            ]
        })

        let opts = Config.instance()['$options']
        expect(opts.configs.length).to.eq(1)
        expect(opts.handlers.length).to.eq(2)
        expect(opts.fileSupport.length).to.eq(3)


        // config with extending current settings
        Config['$self'] = null
        Config.options({
            handlers: ['./src/config/handler/FileConfig.ts'],
            fileSupport: [JsonFileSupport],
            configs: [<IFileConfigOptions>{
                namespace: 'other',
                type: 'file',
                file: './test/config/testfolder_file/config/default.json'
            }]

        })
        opts = Config.instance()['$options']
        expect(opts.configs.length).to.eq(1)
        expect(opts.handlers.length).to.gt(2)
        expect(opts.fileSupport.length).to.not.eq(0)


        // config with overriding current settings
        Config['$self'] = null
        Config.options({
            handlers: ['./src/config/handler/FileConfig.ts'],
            fileSupport: [JsonFileSupport],
            configs: [<IFileConfigOptions>{
                namespace: 'other',
                type: 'file',
                file: './test/config/testfolder_file/config/default.json'
            }]

        }, false)
        opts = Config.instance()['$options']
        expect(opts.configs.length).to.eq(1)
        expect(opts.handlers.length).to.eq(1)
        expect(opts.fileSupport.length).to.eq(1)


        // config with overriding current settings with file path
        Config['$self'] = null
        Config.options({
            handlers: ['./src/config/handler/FileConfig.ts'],
            fileSupport: [JsonFileSupport],
            configs: [<IFileConfigOptions>{
                namespace: 'other',
                type: 'file',
                file: {
                    dirname: './test/config/testfolder_file/config',
                    filename: 'default'
                }
            }]
        }, false)
        opts = Config.instance()['$options']

        let jars = Config.instance()['$jars']
        let keys = Object.keys(jars)
        expect(keys.length).to.eq(1)
        let first_key = keys.shift()
        expect(opts.configs.length).to.eq(1)
        expect(opts.handlers.length).to.eq(1)
        expect(opts.fileSupport.length).to.eq(1)

        expect(first_key).to.eq('other')
        expect(jars[first_key]['_source'][0].source).to.eq('file')
        expect(jars[first_key]['_source'][0]['file'].dirname).to.eq(__dirname + '/testfolder_file/config')
        expect(jars[first_key]['_source'][0]['file'].filename).to.eq('default')
        expect(jars[first_key]['_source'][0]['file'].type).to.eq('json')

        expect(Config.get('hallo')).to.eq('welt')


        Config['$self'] = null
        process.env.hostname = 'testhost'
        process.env.stage = 'testing'
        Config.options({
            handlers: ['./src/config/handler/FileConfig.ts','./src/config/handler/SystemConfig.ts'],
            fileSupport: [JsonFileSupport],
            configs: [
                {
                    type: 'system'
                },
                <IFileConfigOptions>{
                    namespace: 'other',
                    type: 'file',
                    file: {
                        dirname: './test/config/testfolder_file/config',
                        filename: 'default'
                    },
                    pattern: [
                        'default-${env.hostname}',
                        'default-${env.hostname}-${env.stage}'
                    ]
                }
            ]
        }, false)
    }

}