import {suite, test} from "mocha-typescript";
import {Utils} from "../../src/utils/Utils";
import {SystemConfig} from "../../src/config/handler/SystemConfig";
import {FileConfig} from "../../src/config/handler/FileConfig";
import deepmerge = require("deepmerge");
import {expect} from "chai";


@suite('fixtures/issues_180111')
class Tests {

  @test
  'deepmerge upgrade to v2'() {

    let res1 = deepmerge.all([{cfg: [1]}, {cfg: [2]}]);
    expect(res1).to.deep.eq({cfg: [1, 2]});

    let res2 = deepmerge.all([{cfg: <any[]>[SystemConfig]}, {cfg: <any[]>[FileConfig]}]);
    expect(res2).to.deep.eq({cfg: [SystemConfig, FileConfig]});

    let res3 = deepmerge.all([{cfg: <any[]>[SystemConfig]}, {cfg: <any[]>[SystemConfig]}]);
    expect(res3).to.deep.eq({cfg: [SystemConfig, SystemConfig]});

    let resArr1 = Utils.mergeArray(<any[]>[SystemConfig], <any[]>[FileConfig]);
    expect(resArr1).to.deep.eq([SystemConfig, FileConfig]);

    let resArr2 = Utils.mergeArray(<any[]>[SystemConfig], <any[]>[SystemConfig]);
    expect(resArr2).to.deep.eq([SystemConfig]);


    /*
        let resCon = _.concat(<any[]>[SystemConfig],<any[]>[FileConfig]);
        console.log(resCon);
        for(let entry of resCon){
          let x = null
          if(_.isFunction(entry)){
            x = entry.toString();
          }else{
            x = JSON.stringify(entry);
          }
      console.log(x)
        }

        resCon = _.uniqBy(resCon,(_r)=>{return JSON.stringify(_r)});
    */


    let resCfg = deepmerge.all([{cfg: <any>[SystemConfig]}, {cfg: <any>[FileConfig]}], {arrayMerge: Utils.mergeArray});
    expect(resCfg).to.deep.eq({cfg: [SystemConfig, FileConfig]});

    let resCfg2 = deepmerge.all([{cfg: <any>[SystemConfig]}, {cfg: <any>[SystemConfig]}], {arrayMerge: Utils.mergeArray});
    expect(resCfg2).to.deep.eq({cfg: [SystemConfig]});
  }


}
