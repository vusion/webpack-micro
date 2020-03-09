import * as path from 'path';
import shell from 'shelljs';
import micro from './micro';
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
    micro: {
        app: {
            name: string;
            id: string;
            description?: string;
        };
        version: string;
        id: string;
    };
    record: boolean;
    refresh: boolean;
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
            options.path = path.join(process.cwd(), options.micro.app.name);
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
            if (options.record) {
                const recordData = {
                    version: commitId,
                    assets: JSON.stringify(assets),
                    microAppId: options.micro.app.id,
                    description: options.micro.app.description,
                };
                micro.recordSupAppVersion(recordData).then((): void => {
                    console.log('record version success');
                    if (options.record) {
                        const refreshData = {
                            microId: options.micro.id,
                            microVersion: options.micro.version,
                            microAppVersion: commitId,
                            microAppId: options.micro.app.id,
                        };
                        micro.refreshAppVersion(refreshData).then((): void => {
                            console.error('refresh version success');
                        }, (): void => {
                            console.error('refresh version fail');
                            console.log(JSON.stringify(refreshData, null, 4));
                        });
                    }
                }, (): void => {
                    console.error('record version fail');
                    console.log(JSON.stringify(recordData, null, 4));
                });
            }
            return JSON.stringify(assets);
        },
        super(options);
    }
}