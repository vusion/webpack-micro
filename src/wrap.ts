import { ConcatSource } from 'webpack-sources';
import fs from 'fs';
import path from 'path';
interface Options {
    microName: string;
    lib?: string;
    global?: string[];
}
interface Wrap {
    beforeContent: string;
    afterContent: string;
}
function getWrap(microName, content, isEntry): Wrap {
    const alias = `window["${microName}"]`;
    let beforeContent = ';(function(window,console,setTimeout,setInterval){\n return ';
    const afterContent = `\n})(window.microApp._window,window.microApp._console,window.microApp._setTimeout,window.microApp._setInterval);`;
    if (isEntry) {
        beforeContent = `${content};if (window.microApp._window && window.microApp._window.microApp){window.microApp._window.microApp.microName="${microName}";}${alias}=window.microApp` + beforeContent;
    }
    return {
        beforeContent,
        afterContent,
    };
}
export default class WrapMicroPlugin {
    private content: string;
    private microName: string;
    public constructor(options: Options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        const libPath = options.lib || path.join(process.cwd(), './node_modules/vusion-micro-app/dist/es5.js');
        this.content = fs.readFileSync(libPath).toString();
        this.microName = options.microName;
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
                const { beforeContent, afterContent } = getWrap(this.microName, this.content, isEntry);
                compilation.assets[distChunk] = new ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
                files.slice(1).forEach((item): void => {
                    const { beforeContent, afterContent } = getWrap(this.microName, this.content, isEntry);
                    compilation.assets[item] = new ConcatSource(beforeContent, compilation.assets[item], afterContent);
                });
            }
            next();
        });
    }
}