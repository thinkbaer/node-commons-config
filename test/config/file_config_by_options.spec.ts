import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {Config} from "../../src/config/Config";
import {IFileConfigOptions} from "../../src/config/handler/IFileConfigOptions";
import {JsonFileSupport} from "../../src/filesupport/types/JsonFileSupport";
import {ConfigHandler} from "../../src/config/ConfigHandler";
import {PlatformUtils} from "commons-base";

const SUBTESTPATH: string = 'testfolders/file/config';


@suite('config/handler/FileConfig loaded by Config.options')
class FileConfigTests {


  @test
  'load by options'() {
    // config
    Config.clear();
    let opts = Config.options({
      configs: [
        <IFileConfigOptions>{
          type: 'file',
          file: `./test/${SUBTESTPATH}/default.json`
        }
      ]
    });

    expect(opts.configs.length).to.eq(2);
    expect(opts.handlers.length).to.eq(3);
    expect(opts.fileSupport.length).to.eq(4);


    // config with extending current settings
    Config['$self'] = null;
    Config.options({
      handlers: ['./src/config/handler/FileConfig.ts'],
      fileSupport: [JsonFileSupport],
      configs: [<IFileConfigOptions>{
        namespace: 'other',
        type: 'file',
        file: `./test/${SUBTESTPATH}/default.json`
      }]

    });
    opts = Config.instance()['$options'];
    expect(opts.configs.length).to.eq(2);
    expect(opts.handlers.length).to.eq(4);
    expect(ConfigHandler.amount()).to.eq(3);
    expect(opts.fileSupport.length).to.not.eq(0);


    // config with overriding current settings
    Config['$self'] = null;
    Config.options({
      handlers: ['./src/config/handler/FileConfig.ts'],
      fileSupport: [JsonFileSupport],
      configs: [<IFileConfigOptions>{
        namespace: 'other',
        type: 'file',
        file: `./test/${SUBTESTPATH}/default.json`
      }]

    }, false);
    opts = Config.instance()['$options'];
    expect(opts.configs.length).to.eq(1);
    expect(opts.handlers.length).to.eq(1);
    expect(opts.fileSupport.length).to.eq(1);


    // config with overriding current settings with file path
    Config['$self'] = null;
    Config.options({
      handlers: ['./src/config/handler/FileConfig.ts'],
      fileSupport: [JsonFileSupport],
      configs: [<IFileConfigOptions>{
        namespace: 'other',
        type: 'file',
        file: {
          dirname: `./test/${SUBTESTPATH}`,
          filename: 'default'
        }
      }]
    }, false);
    opts = Config.instance()['$options'];

    let jars = Config.instance()['$jars'];
    let keys = Object.keys(jars);
    expect(keys.length).to.eq(1);
    let first_key = keys.shift();
    expect(opts.configs.length).to.eq(1);
    expect(opts.handlers.length).to.eq(1);
    expect(opts.fileSupport.length).to.eq(1);

    expect(first_key).to.eq('other');
    expect(jars[first_key]['_source'][0].source).to.eq('file');
    expect(jars[first_key]['_source'][0]['file'].dirname).to.eq(PlatformUtils.pathNormilize(__dirname + `/../${SUBTESTPATH}`));
    expect(jars[first_key]['_source'][0]['file'].filename).to.eq('default');
    expect(jars[first_key]['_source'][0]['file'].type).to.eq('json');

    expect(Config.get('hallo')).to.eq('welt');


    Config['$self'] = null;
    process.env.hostname = 'testhost';
    process.env.stage = 'testing';
    Config.options({
      handlers: [
        './src/config/handler/FileConfig.ts',
        './src/config/handler/SystemConfig.ts'
      ],
      fileSupport: [
        JsonFileSupport
      ],
      configs: [
        {
          type: 'system'
        },
        <IFileConfigOptions>{
          namespace: 'other',
          type: 'file',
          file: {
            dirname: `./test/${SUBTESTPATH}`,
            filename: 'default'
          },
          pattern: [
            'default-${env.hostname}',
            'default-${env.hostname}-${env.stage}'
          ]
        }
      ]
    }, false)
  }

  @test
  'failed loading by options'() {
    process.env['configfile'] = './file_not_exits.json';
    Config.clear();
    let opts = Config.options({configs: [{type: 'file', file: './relativ_wrong_file.json'}]});

    expect(opts.configs).has.length(2);
    expect(opts.configs).to.deep.include({type: 'system', state: true});
    expect(opts.configs).to.deep.include({type: 'file', file: './relativ_wrong_file.json', state: false});

    // Interpolation arguments not set!
    Config.clear();
    opts = Config.options({configs: [{type: 'file', file: '${argv.configfile2}'}]});

    expect(opts.configs).has.length(2);
    expect(opts.configs).to.deep.include({type: 'system', state: true});
    expect(opts.configs).to.deep.include({type: 'file', file: '${argv.configfile2}', state: false});

    // Interpolation arguments is set, but file doesn't exists!
    Config.clear();
    opts = Config.options({configs: [{type: 'file', file: '${env.configfile}'}]});

    expect(opts.configs).has.length(2);
    expect(opts.configs).to.deep.include({type: 'system', state: true});
    expect(opts.configs).to.deep.include({type: 'file', file: './file_not_exits.json', state: false});

    // Interpolation arguments is set, but file doesn't exists!
    Config.clear();
    process.env['configfile'] = `./test/${SUBTESTPATH}/default.json`;
    opts = Config.options({configs: [{type: 'file', file: '${env.configfile}'}]});

    expect(opts.configs).has.length(2);
    expect(opts.configs[0]).to.deep.include({type: 'system', state: true});
    expect(opts.configs[1]).to.deep.include({
      type: 'file',
      file: process.env['configfile'],
      state: true,
      namespace: 'default'
    })
  }

  @test
  'interpolate by previous file loaded vars'() {
    Config.clear();
    let dir = `./test/${SUBTESTPATH}`
    let opts = Config.options({
      configs: [
        {type: 'file', file: dir + '/app.json'},
        {type: 'file', file: dir + '/${appname}.json'}
      ]
    });
    expect(opts.configs).to.have.length(3)
    expect(opts.configs[2]).to.deep.include({
      type: 'file',
      file: dir + '/hallo.json',
      state: true,
      namespace: 'default'
    })

  }


  @test
  'set workdir'() {
    Config.clear();
    let dir = `./test/${SUBTESTPATH}`;
    let opts = Config.options({
      workdir:dir,
      configs: [{type: 'file', file: './app.json'}]
    });

    expect(opts.workdir).to.eq('./test/testfolders/file/config');
    expect(opts.configs).to.have.length(2)
    expect(opts.configs[1]).to.deep.include({
      type: 'file',
      file: './app.json',
      state: true,
      namespace: 'default'
    });

    let name = Config.get('appname');
    expect(name).to.eq('hallo');
  }


}
