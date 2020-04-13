import { ConcatSource } from 'webpack-sources';
interface Options {
    microName: string;
    afterContent?: string;
    beforeContent?: string;
}
interface Wrap {
    beforeContent: string;
    afterContent: string;
}
function getWrap(microName, beforeContent, afterContent): Wrap {
    const alias = `window["${microName}"]`;
    beforeContent = beforeContent || `;(function(window,console,setTimeout,setInterval){\n `;
    afterContent = afterContent || `\n})(${alias}._window,${alias}._console,${alias}._setTimeout,${alias}._setInterval);`;
    return {
        beforeContent: `if (${alias}._window && ${alias}._window.microApp) {${alias}._window.microApp.isWrapRunning = true;};` + beforeContent,
        afterContent: afterContent + `;if (${alias}._window && ${alias}._window.microApp) {${alias}._window.microApp.isWrapRunning = false;} \n`,
    };
}
const isJsFile = function (str): boolean {
    return str.endsWith('.js');
};
export default class WrapMicroPlugin {
    private microName: string;
    private afterContent: string;
    private beforeContent: string;
    public constructor(options: Options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
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
            for (let i = 0, len = chunks.length; i < len; i++) {
                const files = chunks[i].files;
                files.forEach((file): void => {
                    if (isJsFile(file)) {
                        const { beforeContent, afterContent } = getWrap(this.microName, this.beforeContent, this.afterContent);
                        compilation.assets[file] = new ConcatSource(beforeContent, compilation.assets[file], afterContent);
                    }
                });
            }
            next();
        });
    }
}