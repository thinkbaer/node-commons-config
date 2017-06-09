
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {InterpolationSupport} from "../../src/supports/InterpolationSupport";
import {IConfigData} from "../../src/config/IConfigData";
import {Utils} from "../../src/utils/Utils";



@suite('supports/InterpolationSupports')
class InterpolationSupportsTests {


    @test
    'exec' (){
        // simple test
        let data : IConfigData = {x:'test',y:'${x}'}
        let x = Utils.get(data,'x')
        expect(x).to.eq('test')

        let supporter = new InterpolationSupport()
        supporter.exec(data)
        expect(data).to.deep.eq({x:'test',y:'test'})

        data = {x:'test',y:'inline ${x}!'}
        supporter.exec(data)
        expect(data).to.deep.eq({x:'test',y:'inline test!'})
    }

}