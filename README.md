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

generate assets info

```javascript
import { Plugin } from  'webpack-micro';
new Plugin(options);
```

#### options

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
    microName: string; // micro name
}
```
