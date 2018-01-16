import {suite, test} from "mocha-typescript";
import {expect} from "chai";

import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";
import {ClassLoader} from "commons-base";


//import * as config from 'config';


@suite('utils/Classloader')
class ClassLoaderTests {

  @test
  'import classes from any'() {
    let res = ClassLoader.importClassesFromAny(
      [__dirname + '/../../src/filesupport/types/JsonFileSupport.ts']);
    expect(res.length).to.be.eq(1);


    res = ClassLoader.importClassesFromAny(
      [__dirname + '/../../src/filesupport/types/*.ts']);
    expect(res.length).to.not.eq(0);

    res = ClassLoader.importClassesFromAny(
      [JsonFileSupport]);
    expect(res.length).to.not.eq(0)
  }


}
