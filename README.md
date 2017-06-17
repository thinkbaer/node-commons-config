
# node-commons-config

[![Build Status](https://travis-ci.org/thinkbaer/node-commons-config.svg?branch=master)](https://travis-ci.org/thinkbaer/node-commons-config)
[![codecov](https://codecov.io/gh/thinkbaer/node-commons-config/branch/master/graph/badge.svg)](https://codecov.io/gh/thinkbaer/node-commons-config)


Commons-config is a configurable configuration content handler which supports
multiple configuration infrastructures and file formats.

Feature:

* Typescript support
* Interpolation
* Namespacing
* Extendable by own handler or file support
* Multiple files
* Multiple configuration variants combination possible


## File type support

* Json
* Yaml
* Xml
* other in development

## Supported configuration types

### System configuration

```ts
import {Config} from "commons-config";

Config.options({
    configs: [
        {
            type: 'system'
        }
    ]
})

let hostname = Config.get('os.hostname')
let stage = Config.get('env.stage')
```


### File configuration

Sample file structure:

```
./config/
    default.yml
    default-devhost.yml
    default-prodhost-production.yml
    secrets-devhost.yml
    secrets-prodhost-production.yml
```

Sample code:

```ts
import {Config} from "commons-config";

Config.options({
    configs: [
        {
            type: 'file',
            file: {
                dirname: `./config`,
                filename: 'default'
            },
            pattern: [
                'default-${os.hostname}',
                'default-${os.hostname}-${env.stage}'
                'secrets-${os.hostname}'
            ]
        }
    ]
}
```

### Directory configuration

Sample file structure:

```
./config/
    default.yml
./config/schema/
    db_access.yml
    db_access-production.yml
    db_structure.yml
./config/modules/
    module01.json
    module02.yml

```


Sample code:

```ts
import {Config} from "commons-config";

Config.options({
    configs: [
        {
            type: 'directory',
            dirname: './config',
            prefixing: 'by_dirname'
            suffixPattern: [
                '${env.stage}',
                '${os.hostname}',
                '${os.hostname}-${env.stage}'
            ]
        }
    ]
}

let userName = Config.get('schema.database.user')
```

### Combinig multiple configuration types

Sample file structure:

```
./
    secrets.yml
    secrets-prodhost.yml
./config/
    default.yml
./config/schema/
    db_access.yml
    db_access-production.yml
    db_structure.yml
./config/modules/
    module01.json
    module02.yml

```


Sample file structure:

```ts
import {Config} from "commons-config";

Config.options({
    configs: [
        {
            type: 'system'
        },
        {
            type: 'file',
            file: {
                dirname: `./`,
                filename: 'default'
            },
            pattern: [
                'secrets-${os.hostname}'
            ]
        },
        {
            type: 'directory',
            dirname: './config',
            prefixing: 'by_dirname'
            suffixPattern: [
                '${env.stage}',
                '${os.hostname}',
                '${os.hostname}-${env.stage}'
            ]
        }
    ]
}

```



## Embedding in code

Integration in javascript source code:

```js
const commons_config = require('commons-config')
const Config = commons_config.Config

Config.options({ ... })
```

Integration in typescript source code:

```js
import {Config} from "commons-config";

Config.options({ ... })
```




