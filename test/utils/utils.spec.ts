import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {Utils} from "../../src/utils/Utils";
import {inspect} from "util";


@suite('utils/Utils')
class UtilsTests {

  @test
  'set'() {
    // set first value x=1
    let x: any = {};
    let z = Utils.set(x, 'x', 1);
    expect(z).to.be.true;
    expect(x).to.deep.eq({x: 1});

    // set first value y=2
    z = Utils.set(x, 'y', 2);
    expect(z).to.be.true;
    expect(x).to.deep.eq({x: 1, y: 2});

    z = Utils.set(x, 'z.0', 3);
    expect(z).to.be.true;
    expect(x).to.deep.eq({x: 1, y: 2, z: [3]});

    z = Utils.set(x, 'z.1', 4);
    expect(z).to.be.true;
    expect(x).to.deep.eq({x: 1, y: 2, z: [3, 4]});

    // Override existing as array
    z = Utils.set(x, 'z.1', 5);
    expect(z).to.be.true;
    expect(x).to.deep.eq({x: 1, y: 2, z: [3, 5]});

    // Override failed wrong type
    z = Utils.set(x, 'z', 5);
    expect(z).to.be.false;
    expect(x).to.deep.eq({x: 1, y: 2, z: [3, 5]})

    // set array y.0 => create array
    // set array z.x => create object


    /*
     z = Utils.set(x,'z',3)
     expect(z).to.be.true
     expect(x).to.deep.eq({x:2,y:1,z:3})

     // Override?
     /*
     z = Utils.set(x,'x.y',2)
     expect(z).to.be.true
     expect(x).to.deep.eq({x:{y:2},y:1})
     */
  }

  @test
  'get'() {
    let x: any = {x: 1, y: 1};
    let z = Utils.get(x, 'x');
    expect(z).to.eq(1);

    x = {x: {y: 2}};
    z = Utils.get(x, 'x.y');
    expect(z).to.eq(2);

    x = {x: {y: ['test']}};
    z = Utils.get(x, 'x.y.0');
    expect(z).to.eq('test');

    x = {x: {y: ['test']}};
    z = Utils.get(x, 'x.y.1');
    expect(z).to.null
  }

  @test
  'walk'() {
    let x: any = {x: 1, y: 1};
    Utils.walk(x, (data: any) => {
      data.parent[data.key] = 2
    });
    expect(x).to.deep.eq({x: 2, y: 2})

  }


  @test
  'merge'() {
    // Combine two arrays
    let x: any = {x: 1};
    let y: any = {y: 1};
    let z: any = Utils.merge(x, y);
    expect(z).to.deep.eq({x: 1, y: 1});

    // Override first with second
    x = {x: 1};
    y = {x: 2};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({x: 2});

    // Array merge
    x = {x: ['asd']};
    y = {x: ['cbd']};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({x: ['asd', 'cbd']});

    // Array object merge
    x = {x: [{z: 2}]};
    y = {x: [{z: 2}]};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq(x);

    // Array object merge
    x = {x: [{z: 2}]};
    y = {x: [{y: 2}]};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({x: [{z: 2}, {y: 2}]});

    // Array object merge
    x = {configs: [{type: 'system'}]};
    y = {configs: [{type: 'file', file: 'somefile1'}]};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({configs: [{type: 'system'}, {type: 'file', file: 'somefile1'}]});

    // Array object merge
    x = {x: [{z: 2}]};
    y = {x: [{}, {y: 2}]};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({x: [{z: 2}, {}, {y: 2}]});

    // deep merge
    x = {x: {d: 1, c: 1, e: {a: 1, b: 2}}};
    y = {x: {d: 1, c: 1, e: {a: 2}}};
    z = Utils.merge(x, y);
    expect(z).to.deep.eq({x: {d: 1, c: 1, e: {a: 2, b: 2}}})

    const DEFAULT_RUNTIME_OPTIONS: any =

      {
        "app": {
          "name": "test",
          "path": "test/functional/bootstrap/fake_app"
        },
        "modules": {
          "appdir": ".",
          "paths": [],
          "included": {},
          "subModulPattern": [
            "packages",
            "src/packages"
          ],
          "libs": [
            {
              "topic": "activator.js",
              "refs": [
                "Activator",
                "src/Activator"
              ]
            },
            {
              "topic": "bootstrap.js",
              "refs": [
                "Bootstrap",
                "src/Bootstrap",
                "Startup",
                "src/Startup"
              ]
            },
            {
              "topic": "api",
              "refs": [
                "api/*.api.*",
                "src/api/*.api.*"
              ]
            },
            {
              "topic": "use_api",
              "refs": [
                "extend/*",
                "src/extend/*"
              ]
            },
            {
              "topic": "commands",
              "refs": [
                "commands",
                "src/commands"
              ]
            },
            {
              "topic": "generators",
              "refs": [
                "generators",
                "src/generators"
              ]
            },
            {
              "topic": "storage.schemahandler.adapters",
              "refs": [
                "adapters/storage/*SchemaHandler.*",
                "src/adapters/storage/*SchemaHandler.*"
              ]
            },
            {
              "topic": "entity.default",
              "refs": [
                "entities",
                "src/entities",
                "shared/entities",
                "src/shared/entities",
                "modules/*/entities",
                "src/modules/*/entities"
              ]
            },
            {
              "topic": "tasks",
              "refs": [
                "tasks",
                "src/tasks"
              ]
            }
          ]
        },
        "logging": {
          "enable": false,
          "events": false
        },
        "storage": {
          "default": {
            "name": "default",
            "type": "sqlite",
            "database": ":memory:",
            "connectOnStartup": false
          }
        }
      }

    const ADD: any = {
      "app": {
        "name": "fake_app"
      },
      "modules": {
        "libs": [
          {
            "topic": "flow",
            "refs": [
              "flow"
            ]
          }
        ]
      }
    }

    let erg = Utils.merge(DEFAULT_RUNTIME_OPTIONS, ADD);
    expect(erg).to.deep.eq({
      "app": {
        "name": "fake_app",
        "path": "test/functional/bootstrap/fake_app"
      },
      "modules": {
        "appdir": ".",
        "paths": [],
        "included": {},
        "subModulPattern": [
          "packages",
          "src/packages"
        ],
        "libs": [
          {
            "topic": "activator.js",
            "refs": [
              "Activator",
              "src/Activator"
            ]
          },
          {
            "topic": "bootstrap.js",
            "refs": [
              "Bootstrap",
              "src/Bootstrap",
              "Startup",
              "src/Startup"
            ]
          },
          {
            "topic": "api",
            "refs": [
              "api/*.api.*",
              "src/api/*.api.*"
            ]
          },
          {
            "topic": "use_api",
            "refs": [
              "extend/*",
              "src/extend/*"
            ]
          },
          {
            "topic": "commands",
            "refs": [
              "commands",
              "src/commands"
            ]
          },
          {
            "topic": "generators",
            "refs": [
              "generators",
              "src/generators"
            ]
          },
          {
            "topic": "storage.schemahandler.adapters",
            "refs": [
              "adapters/storage/*SchemaHandler.*",
              "src/adapters/storage/*SchemaHandler.*"
            ]
          },
          {
            "topic": "entity.default",
            "refs": [
              "entities",
              "src/entities",
              "shared/entities",
              "src/shared/entities",
              "modules/*/entities",
              "src/modules/*/entities"
            ]
          },
          {
            "topic": "tasks",
            "refs": [
              "tasks",
              "src/tasks"
            ]
          },
          {
            "topic": "flow",
            "refs": [
              "flow"
            ]
          }
        ]
      },
      "logging": {
        "enable": false,
        "events": false
      },
      "storage": {
        "default": {
          "name": "default",
          "type": "sqlite",
          "database": ":memory:",
          "connectOnStartup": false
        }
      }
    })
  }

  @test
  'clone'() {
    let x: any = {x: 1};
    let y: any = Utils.clone(x);

    expect(x).to.not.eq(y);
    expect(x).to.deep.eq(y)
  }

}
