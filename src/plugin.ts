import * as path from 'path';
import shell from 'shelljs';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
const getCommitId = function (): string {
    try {
        return shell.exec('git rev-parse HEAD').trim();
    } catch (error) {
        console.error(error);
        throw new Error('get commitId error.');
    }
};
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
    public constructor(options: Options) {
        options.fullPath = true;
        options.entrypoints = true;
        let commitId = options.commitId;
        if (!commitId) {
            commitId = options.commitId = getCommitId();
        }
        options.filename = `${commitId}.json`;
        if (!options.path) {
            options.path = path.join(process.cwd(), options.microName);
        }
        const processOutput = options.processOutput;
        options.processOutput = function (assets: Assets): string {
            Object.values(assets).forEach((item): void => {
                item.js && !Array.isArray(item.js) && (item.js = [item.js]);
                item.css && !Array.isArray(item.css) && (item.css = [item.css]);
            });
            if (processOutput) {
                processOutput(assets);
            }
            return JSON.stringify(assets);
        },
        super(options);
    }
}