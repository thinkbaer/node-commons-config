
# node-commons-config

![build status](https://travis-ci.org/thinkbaer/node-commones-config.svg?branch=master)
[![codecov](https://codecov.io/gh/thinkbaer/node-commons-config/branch/master/graph/badge.svg)](https://codecov.io/gh/thinkbaer/node-commons-config)


Commons-config is a configurable configuration content handler which supports
multiple configuration infrastructures and file formats.

Feature:

* Interpolation
* Namespacing
* Extendable by own handler or file support



## System configuration

```js
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


## File configuration

```
./config/
    default.yml
    default-devhost.yml
    default-prodhost-production.yml
    secrets-devhost.yml
    secrets-prodhost-production.yml
```


```ts
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

## Directory configuration


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

```js
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



## File type support

* Json
* Yaml
* Xml


