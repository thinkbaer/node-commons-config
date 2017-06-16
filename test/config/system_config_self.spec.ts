
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {SystemConfig} from "../../src/config/handler/SystemConfig";
import {ConfigJar} from "../../src/config/ConfigJar";



@suite('config/handler/SystemConfig load independently')
class SystemConfigTests {


    @test
    'create and retrieve' (){
        process.argv.push('--hallo','welt')
        process.argv.push('--hallo_welt','--welt_hallo')
        let cfg = new SystemConfig()
        let jar:ConfigJar = <ConfigJar>cfg.create()
        expect(jar.get('argv.hallo')).to.eq('welt')
        expect(jar.get('argv.hallo_welt')).to.be.true
        expect(jar.get('os.hostname')).to.exist
        expect(jar.namespace).to.eq('system')
    }

}