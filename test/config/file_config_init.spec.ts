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
        // Init
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
    }

}