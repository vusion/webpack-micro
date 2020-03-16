import AssetsWebpackPlugin from 'assets-webpack-plugin';
interface AssetsItem {
    js?: string[] | string;
    css?: string[] | string;
    [props: string]: string[] | string;
}
interface Assets {
    [props: string]: AssetsItem;
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
    micro: {
        app: {
            name: string;
            id: string;
            description?: string;
        };
        version?: string;
        versions?: string[];
        id: string;
    };
    record: boolean;
    refresh: boolean;
}
export default class Micro extends AssetsWebpackPlugin {
    constructor(options: Options);
}
export {};
