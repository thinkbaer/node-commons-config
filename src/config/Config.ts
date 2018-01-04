import * as _ from 'lodash';
import {Utils} from "../utils/Utils";

import {ConfigJar} from "./ConfigJar";
import {IOptions} from "./IOptions";
import {IConfigData} from "./IConfigData";

import {ConfigHandler} from "./ConfigHandler";
import {FileSupport} from "../filesupport/FileSupport";
import {IJarOptions} from "./IJarOptions";
import {DEFAULT_JAR_NAME} from "../types";
import {ConfigSupport} from "./ConfigSupport";
import {InterpolationSupport} from "../supports/InterpolationSupport";
import {PlatformTools} from "../";


export class Config {

  private static DEFAULT_OPTIONS: IOptions = {
    fileSupport: FileSupport.DEFAULT_TYPES,
    // handlers: {}DEFAULT_HANDLER,
    configs: [
      {
        type: 'system'
      }
    ]
  };

  private static $self: Config = null;

  private $options: IOptions = {};

  private $jars: { [k: string]: ConfigJar } = {};

  private $init: boolean = false;


  private constructor() {

  }

  static instance(init: boolean = true): Config {
    if (!this.$self) {
      this.$self = new Config()
    }

    if (!this.$self.isInitialized() && init) {
      this.$self._options(this.DEFAULT_OPTIONS)
    }

    return this.$self
  }

  isInitialized() {
    return this.$init
  }



  static jar(name: string | IJarOptions = 'default', jar?: ConfigJar): ConfigJar {
    return this.instance(false)._jar(name, jar)
  }

  _jar(name: string | IJarOptions = 'default', jar?: ConfigJar, override: boolean = false): ConfigJar {
    let options: IJarOptions = {namespace: DEFAULT_JAR_NAME};
    let _name: string = null;
    if (!Utils.isString(name)) {
      options = <IJarOptions>name;
      _name = options.namespace
    } else {
      _name = <string>name;
      options.namespace = _name
    }

    if (this.$jars[_name] && !jar) {
      // jar already exists
      if (options && override) {
        this.$jars[_name] = ConfigJar.create(options)
      }
    } else if (this.$jars[_name] && jar) {
      if (!override) {
        throw new Error('config jar is already set')
      }
      this.$jars[_name] = jar
    } else if (!this.$jars[_name] && jar) {
      this.$jars[_name] = jar
    } else {
      this.$jars[_name] = ConfigJar.create(options)
    }
    return this.$jars[_name]
  }

  // TODO return immutable
  static get jars(): ConfigJar[] {
    return this.instance(false)._jars
  }

  get _jars(): ConfigJar[] {
    let self = this;
    let jars: ConfigJar[] = [];
    Object.keys(this.$jars).forEach(k => {
      jars.push(self.$jars[k])
    });
    return jars
  }


  static all(): IConfigData[] {
    return this.instance(false)._jarsData
  }

  static get jarsData(): IConfigData[] {
    return this.instance(false)._jarsData
  }

  get _jarsData(): IConfigData[] {
    let self = this;
    let jars: IConfigData[] = [];
    Object.keys(this.$jars).forEach(k => {
      jars.push(self.$jars[k].data)
    });
    return jars
  }


  static hasJar(name: string): boolean {
    return this.instance(false)._hasJar(name)
  }

  _hasJar(name: string): boolean {
    return !!this.$jars[name]
  }

  static options(options: IOptions = null, append: boolean = true): IOptions {
    return this.instance()._options(options, append)
  }


  _options(_options: IOptions = null, append: boolean = true): IOptions {
    if (_options == null) {
      return this.$options
    }

    this.$init = true;

    let options: IOptions = {}
    if (!_options.configs) {
      // Test if configs key was ignored
      if (Utils.isArray(_options) && _options.length > 0) {
        if (_options[0].type) {
          // okay configs was ignored, prepend it!
          options = <IOptions>{configs: _options}
        } else {
          options = {}
        }
      } else {
        options = _options
      }
    } else {
      options = _options
    }

    if (append) {
      this.$options = Utils.merge(this.$options, options)
    } else {
      // clear current jars
      this.$jars = {};
      Object.assign(this.$options, options)
    }


    if (this.$options.fileSupport) {
      FileSupport.reload(this.$options.fileSupport)
    }

    if (!this.$options.handlers || this.$options.handlers.length === 0) {
      this.$options.handlers = ConfigHandler.DEFAULT_HANDLER
    }

    if(!_.isEmpty(this.$options.workdir)){
      PlatformTools.setWorkDir(this.$options.workdir);
    }else{
      PlatformTools.setWorkDir(null);
    }

    ConfigHandler.reload(this.$options.handlers);

    for (let _config of this.$options.configs) {
      let handler: ConfigSupport<any> = ConfigHandler.getHandlerByType(_config.type, _config, this._jarsData);
      if (handler) {
        let jar = handler.create();

        if (jar) {
          _config.state = true;
          if (Utils.isArray(jar)) {
            for (let _jar of <ConfigJar[]>jar) {
              let _inst_jar = Config.jar(_jar.namespace);
              InterpolationSupport.exec(_config, _inst_jar.data);
              _inst_jar.merge(_jar.data);
              _inst_jar.sources(_jar.sources())
            }
          } else {
            let _jar = <ConfigJar>jar;
            let _inst_jar = Config.jar(_jar.namespace);
            InterpolationSupport.exec(_config, _inst_jar.data);
            // InterpolationSupport.exec(_inst_jar.data,this._jarsData);
            _inst_jar.merge(_jar.data);
            _inst_jar.sources(_jar.sources())
          }
        } else {
          _config.state = false
        }
      } else {
        throw new Error('handler doesn\'t exists')
      }
    }
    return this.$options
  }


  static get(path: string = null, namespace_or_fallback?: any, fallback?: any) {
    if (path == null) {
      return this.jarsData;
    }
    let jars: ConfigJar[] = this.jars;

    if (Utils.isString(namespace_or_fallback) && this.hasJar(namespace_or_fallback)) {
      jars = [this.jar(namespace_or_fallback)];
    } else {
      fallback = namespace_or_fallback;
      jars = this.jars;
    }

    let _value: any = null;
    for (let i = 0; i < jars.length; i++) {
      _value = jars[i].get(path);
      if (_value) break;
    }

    if (!_value && fallback) {
      return fallback;
    }
    return _value;
  }


  static set(path: string, value: any, namespace: string = 'default'): boolean {
    let jar: ConfigJar = Config.jar(namespace);
    return jar.set(path, value)
  }

  static clear(): void {
    this.$self = null;
    PlatformTools.setWorkDir(null);
  }


}
