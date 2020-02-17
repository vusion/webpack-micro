import AssetsWebpackPlugin from 'assets-webpack-plugin';
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
    processOutput: (assets: Assets) => string | void;
    path?: string;
    commitId?: string;
    microName: string;
}
export default class Micro extends AssetsWebpackPlugin {
    constructor(options: Options);
}
export {};
