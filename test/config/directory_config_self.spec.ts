import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {DirectoryConfig} from "../../src/config/handler/DirectoryConfig";
import {Utils} from "../../src/utils/Utils";
import {IDirectoryConfigOptions} from "../../src/config/handler/IDirectoryConfigOptions";
import {NAMING_BY_DIRECTORYPATH} from "../../src/types";

@suite('config/handler/DirectoryConfig load independently')
class DirectoryConfigTests {


    @test
    'list files in directory'() {
        let opts: IDirectoryConfigOptions;
        let dirCfg: DirectoryConfig;
        let files;
        let first;

        opts =
            {
                dirname: './test/testfolders/submodules_dirs'
            }

        dirCfg = new DirectoryConfig(opts)
        files = dirCfg.listFilesInDirectory()
        expect(files.length).to.eq(6)

        // suffixPattern
        opts = Utils.merge(DirectoryConfig.DEFAULT_DIRECTORY_OPTIONS,
            {
                dirname: './test/testfolders/submodules_dirs',
                suffixPattern: ['${os.hostname}']
            }
        )
        dirCfg = new DirectoryConfig(opts)
        files = dirCfg.listFilesInDirectory()
        expect(files.length).to.eq(6)
        first = files.shift()
        expect(first.namespace).to.eq('default')
        expect(first.file['filename']).to.eq('default')
        expect(first.pattern).to.include('default-${os.hostname}')

        // namespacing
        opts =
            <IDirectoryConfigOptions>{
                dirname: './test/testfolders/submodules_dirs',
                namespaceing: NAMING_BY_DIRECTORYPATH
            }

        dirCfg = new DirectoryConfig(opts)
        files = dirCfg.listFilesInDirectory()
        expect(files.length).to.eq(6)
        first = files.shift()
        expect(first.namespace).to.eq('config_01')
        expect(first.file['filename']).to.eq('default')
        //expect(first.pattern).to.include('default-${os.hostname}')

        // prefixing
        opts =
            <IDirectoryConfigOptions>{
                dirname: './test/testfolders/submodules_dirs',
                prefixing: NAMING_BY_DIRECTORYPATH
            }

        dirCfg = new DirectoryConfig(opts)
        files = dirCfg.listFilesInDirectory()
        console.log(files)
        expect(files.length).to.eq(6)
        first = files.shift()
        expect(first.namespace).to.eq('default')
        expect(first.prefix).to.eq('config_01')
        expect(first.file['filename']).to.eq('default')

    }

}