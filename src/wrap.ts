import { ConcatSource } from 'webpack-sources';
import fs from 'fs';
import path from 'path';
interface Options {
    microName: string;
    lib?: string;
    afterContent?: string;
    beforeContent?: string;
}
interface Wrap {
    beforeContent: string;
    afterContent: string;
}
function getWrap(microName, content, isEntry, beforeContent, afterContent): Wrap {
    const alias = `window["${microName}"]`;
    beforeContent = beforeContent || `;(function(window,console,setTimeout,setInterval){\n return (`;
    afterContent = afterContent || `);\n})(${alias}._window,${alias}._console,${alias}._setTimeout,${alias}._setInterval);`;
    if (isEntry) {
        beforeContent = `;(function(){var a=window.microName; window.microName="${microName}";${content};window.microName=a;})();${alias}=window.microApp;if (${alias}._window && ${alias}._window.microApp) {${alias}._window.microApp.isWrapRunning = true;}` + beforeContent;
    }
    return {
        beforeContent,
        afterContent: afterContent + `;if (${alias}._window && ${alias}._window.microApp) {${alias}._window.microApp.isWrapRunning = false;} \n`,
    };
}
const isJsFile = function (str): boolean {
    return str.endsWith('.js');
};
export default class WrapMicroPlugin {
    private content: string;
    private microName: string;
    private afterContent: string;
    private beforeContent: string;
    public constructor(options: Options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        const libPath = options.lib || path.join(process.cwd(), './node_modules/vusion-micro-app/dist/es5.js');
        this.content = fs.readFileSync(libPath).toString();
        this.microName = options.microName;
        this.beforeContent = options.beforeContent;
        this.afterContent = options.afterContent;
        if (Number(!!this.beforeContent) + Number(!!this.afterContent) === 1) {
            throw new TypeError('beforeContent afterContent is required');
        }
    }
    public apply(compiler): void {
        compiler.hooks.emit.tapAsync('WrapMicroPlugin', (compilation, next): void => {
            const chunks = compilation.chunks;
            const entries = [];
            compilation.entrypoints.forEach((item, k): void => {
                entries.push(k);
            });
            for (let i = 0, len = chunks.length; i < len; i++) {
                const files = chunks[i].files;
                const distChunk = files[0];
                const isEntry = entries.includes(chunks[i].name);
                if (isJsFile(distChunk)) {
                    const { beforeContent, afterContent } = getWrap(this.microName, this.content, isEntry, this.beforeContent, this.afterContent);
                    compilation.assets[distChunk] = new ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
                }
                files.slice(1).forEach((item): void => {
                    if (isJsFile(item)) {
                        const { beforeContent, afterContent } = getWrap(this.microName, this.content, isEntry, this.beforeContent, this.afterContent);
                        compilation.assets[item] = new ConcatSource(beforeContent, compilation.assets[item], afterContent);
                    }
                });
            }
            next();
        });
    }
}