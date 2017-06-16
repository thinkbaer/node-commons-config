import * as mocha from 'mocha';
describe('', () => {
})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {DirectoryConfig} from "../../src/config/handler/DirectoryConfig";
import {Utils} from "../../src/utils/Utils";
import {IDirectoryConfigOptions} from "../../src/config/handler/IDirectoryConfigOptions";
import {NAMING_BY_DIRECTORYPATH} from "../../src/types";
import {IFileConfigOptions} from "../../src/config/handler/IFileConfigOptions";
import {ConfigJar} from "../../src/config/ConfigJar";
import {inspect} from "util"
import {FileSupport} from "../../src/filesupport/FileSupport";

let opts: IDirectoryConfigOptions;
let dirCfg: DirectoryConfig;
let files:IFileConfigOptions[];
let first;
let jars:ConfigJar[]

@suite('config/handler/DirectoryConfig load independently')
class DirectoryConfigTests {


    @test
    'list files in directory'() {

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
        // console.log(files)
        expect(files.length).to.eq(6)
        first = files.shift()
        expect(first.namespace).to.eq('default')
        expect(first.prefix).to.eq('config_01')
        expect(first.file['filename']).to.eq('default')

    }

    @test
    'exclusion'(){
        opts =
            <IDirectoryConfigOptions>{
                dirname: './test/testfolders/submodules_dirs',
                exclude:['config_02/**']
            }

        dirCfg = new DirectoryConfig(opts)
        files = dirCfg.listFilesInDirectory()
        // console.log(files)
        expect(files.length).to.eq(3)
        first = files.shift()
        expect(first.namespace).to.eq('default')

    }

    @test
    'create'(){
        FileSupport.reload()
        opts =
            <IDirectoryConfigOptions>{
                dirname: './test/testfolders/submodules_dirs',
            }

        dirCfg = new DirectoryConfig(opts)
        jars = dirCfg.create()
        // console.log(inspect(jars,false,10))
        expect(jars.length).to.eq(1)
        expect(jars[0]['_source'].length).to.eq(6)
        expect(jars[0].get('base')).to.eq('default')
        expect(jars[0].get('interpolate')).to.eq('default')
        expect(jars[0].get('base02')).to.eq('default')
        expect(jars[0].get('interpolate02')).to.eq('default')
        expect(jars[0].get('config01')).to.eq('yes')
        expect(jars[0].get('config02')).to.eq('yes')
        expect(jars[0].get('schema01')).to.be.true
        expect(jars[0].get('schema02')).to.be.true


    }

}