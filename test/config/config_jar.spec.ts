
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {FileSupport} from "../../src/filesupport/FileSupport";


//import * as config from 'config';



@suite('config/ConfigJar')
class ConfigJarTests {

    @test
    static before(){
        FileSupport.reload()
    }


    @test
    'default initialization' (){


        let jar = new ConfigJar()
        //console.log(jar)

    }



}