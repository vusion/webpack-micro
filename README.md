# webpack-micro

used for vusion-micro-app

## usage

### loader

```javascript
import { loader } from  'webpack-micro';
{
    test: /\.js$/,
    use: [
        {
            loader,
            options: {
                ignore: ['test.js'],
                addon: {
                    replace: true, // will replace default import,default: false
                    text: `import window as window1 from  'vusion-micro-app'`, // custom import
                },
            },
        },
        {
            loader: 'babel-loader'
        }
    ],
}
```

### plugin

#### MicroAssetsPlugin

generate assets info

```javascript
import { plugin as MicroAssetsPlugin } from  'webpack-micro';
new MicroAssetsPlugin(options);
```

##### options

like assets-webpack-plugin

```typescript
interface Assets {
    [props: string]: {
        js?: string[] | string;
        css?: string[] | string;
        [props: string]: string[] | string;
    };
}
interface Options {
    filename: string;
    prettyPrint: boolean;
    update: boolean;
    includeManifest: boolean;
    manifestFirst: boolean;
    useCompilerPath: boolean;
    fileTypes: string[];
    includeAllFileTypes: boolean;
    keepInMemory: boolean;
    integrity: boolean;
    fullPath: boolean;
    metadata: any;
    entrypoints: boolean;
    processOutput: (assets: Assets) => string | void; // assets object
    path?: string; // file path, will join `microName`
    commitId?: string; // git commitId, if not will auto get
    micro: {
        app: {
            name: string; // subApp name
            id: string; // subApp id
            description?: string; // subApp version description
        },
        version?: string; // app version
        versions?: string[]; // app version
        id: string;  // app id
    };
    record: boolean; // record subApp version in vusion platform.if true, micro.app is required, else micro.app.name is required
    refresh: boolean; // refresh app vusion in vusion platform.if true, micro.id and micro.version are required
    entry: string; // vusion-micro-app entry name. default: micro
}
```

#### WrapMicroPlugin

wrap code with [vusion-micro-app](https://www.npmjs.com/package/vusion-micro-app)

```js
import { wrap as WrapMicroPlugin } from  'webpack-micro';
new WrapMicroPlugin(options);
```

##### options

```typescript
interface Options {
    microName: string;  // microName
    entry: string; // vusion-micro-app entry name. default: micro
}
```
