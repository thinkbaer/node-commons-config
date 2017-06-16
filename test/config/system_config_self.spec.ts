
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";


// import {SystemConfig} from "../../src/config/handler";
import {ConfigHandler} from "../../src/config/ConfigHandler";
import {SystemConfig} from "../../src/config/handler/SystemConfig";



@suite('config/handler/SystemConfig load independently')
class SystemConfigTests {


    @test
    'bootstrap' (){
        //let  SystemConfig:Function = <Function>DEFAULT_HANDLER[0];
        process.argv.push('--hallo','welt')
        process.argv.push('--hallo_welt','--welt_hallo')
        // ConfigHandler.reload()
        let cfg = new SystemConfig() //ConfigHandler.getHandlerByType('system')
        let jar = cfg.create()
        expect(jar.get('argv.hallo')).to.eq('welt')
        expect(jar.get('argv.hallo_welt')).to.be.true
        expect(jar.get('os.hostname')).to.exist

        expect(jar.namespace).to.eq('system')
    }

}