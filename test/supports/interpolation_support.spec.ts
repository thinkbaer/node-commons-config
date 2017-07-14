
import * as mocha from 'mocha';
describe('',()=>{});


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
        let data : IConfigData = {x:'test',y:'${x}'};
        let x = Utils.get(data,'x');
        expect(x).to.eq('test');

        InterpolationSupport.exec(data);
        expect(data).to.deep.eq({x:'test',y:'test'});

        data = {x:'test',y:'inline ${x}!'};
        InterpolationSupport.exec(data);
        expect(data).to.deep.eq({x:'test',y:'inline test!'});

        // test array interpolation
        data = {x:'test',y:['inline ${x}!']};
        InterpolationSupport.exec(data);
        expect(data).to.deep.eq({x:'test',y:['inline test!']});

        // test multiple interpolations in one line
        data = {x:'test',z:5,y:['inline ${x} and ${z}!']};
        InterpolationSupport.exec(data);

        expect(data).to.deep.eq({x:'test',z:5, y:['inline test and 5!']});

        // interpolate against a lookup object
        data = {y:['inline ${x} and ${z}!']};
        InterpolationSupport.exec(data,{x:'test',z:5});
        expect(data).to.deep.eq({y:['inline test and 5!']});

        // interpolate against multiple lookup objects
        data = {y:['inline ${x} and ${z}!']};
        InterpolationSupport.exec(data,{x:'test'},{z:5});
        expect(data).to.deep.eq({y:['inline test and 5!']});

        // interpolate against multiple lookup objects as array
        data = {y:['inline ${x} and ${z}!']};
        InterpolationSupport.exec(data,[{x:'test'},{z:5}]);
        expect(data).to.deep.eq({y:['inline test and 5!']})
    }

}