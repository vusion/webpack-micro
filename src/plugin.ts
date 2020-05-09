import * as path from 'path';
import shell from 'shelljs';
import micro from './micro';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
const getCommitId = function (): string {
    try {
        return shell.exec('git rev-parse HEAD', {
            silent: true
        }).trim();
    } catch (error) {
        console.error(error);
        throw new Error('get commitId error.');
    }
};
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
    entry: string;
}
export default class Micro extends AssetsWebpackPlugin {
    public constructor(options: Options) {
        options.fullPath = true;
        options.entrypoints = true;
        const entry = options.entry || 'micro';
        let commitId = options.commitId;
        if (!commitId) {
            commitId = options.commitId = getCommitId();
        }
        options.filename = options.filename || `${commitId}.json`;
    
        options.useCompilerPath = 'useCompilerPath' in options ? options.useCompilerPath: true;
        options.keepInMemory = 'keepInMemory' in options ? options.keepInMemory: true;
        if (!options.path) {
            options.path = path.join(process.cwd(), options.micro.app.name);
        }
        const processOutput = options.processOutput;
        options.processOutput = function (assets: Assets): string {
            const values = Object.values(assets);
            const microEntryAssets = assets[entry];
            delete assets[entry];
            values.forEach((item): void => {
                item.js && !Array.isArray(item.js) && (item.js = [item.js]);
                item.css && !Array.isArray(item.css) && (item.css = [item.css]);
                if (microEntryAssets) {
                    microEntryAssets.js && !Array.isArray(microEntryAssets.js) && (microEntryAssets.js = [microEntryAssets.js]);
                    item.js = [...(microEntryAssets.js as string[]), ...(item.js  as string[])];  
                }

            });
            let entryAssets = null;
            if (processOutput) {
                entryAssets = processOutput(assets);
                if (!assets.js || !assets.css) {
                    console.error(`processOutput return data like
{
    js?: string[] | string;
    css?: string[] | string;
    [props: string]: string[] | string;
}`);
                }
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
                    if (options.refresh) {
                        let versions = options.micro.versions;
                        const version = options.micro.version;
                        if (version) {
                            versions = [version];
                        }
                        const refreshData = {
                            microId: options.micro.id,
                            microAppVersion: commitId,
                            microAppId: options.micro.app.id,
                        };
                        Promise.all(
                            versions.map((version): Promise<any> => {
                                return micro.refreshAppVersion(Object.assign({
                                    microVersion: version,
                                }, refreshData));
                            })
                        ).then((): void => {
                            console.error('refresh version success');
                        }, (e): void => {
                            console.error('refresh version fail', e);
                            console.log(JSON.stringify(refreshData, null, 4));
                            process.exit(2);
                        });
                    }
                }, (e): void => {
                    console.error('record version fail', e);
                    console.log(JSON.stringify(recordData, null, 4));
                    process.exit(2);
                });
            }
            return entryAssets ? entryAssets : JSON.stringify(assets);
        };
        super(options);
    }
}