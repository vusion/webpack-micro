import { ConcatSource } from 'webpack-sources';
interface Options {
    microName: string;
    entry: string;
    afterContent?: string;
    beforeContent?: string;
}
interface Wrap {
    beforeContent: string;
    afterContent: string;
}
function getWrap(microName, beforeContent, afterContent): Wrap {
    beforeContent = beforeContent || `;(function(window,self,console,setTimeout,setInterval){with(window){\n`;
    afterContent = afterContent || `\n}}).call(_w,_w,_w,_p._console,_p._setTimeout,_p._setInterval);`;
    const worker = `if(!self.document){self._window=self;self._console=console;self._setTimeout=setTimeout;self._setInterval=setInterval;}`;
    return {
        beforeContent: ';(function(_p) {var _w=_p._window;' + worker + `if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};` + beforeContent,
        afterContent: afterContent + `;if (_w && _w.microApp) {_w.microApp.isWrapRunning = false;} \n` + `})(self["${microName}"] || self)`,
    };
}
const isJsFile = function (str): boolean {
    return str.endsWith('.js');
};
export default class WrapMicroPlugin {
    private microName: string;
    private afterContent: string;
    private beforeContent: string;
    private entry: string;
    public constructor(options: Options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        this.microName = options.microName;
        this.beforeContent = options.beforeContent;
        this.afterContent = options.afterContent;
        this.entry = options.entry || 'micro';
        if (Number(!!this.beforeContent) + Number(!!this.afterContent) === 1) {
            throw new TypeError('beforeContent afterContent is required');
        }
    }
    public apply(compiler): void {
        compiler.hooks.emit.tapAsync('WrapMicroPlugin', (compilation, next): void => {
            const chunks = compilation.chunks;
            for (let i = 0, len = chunks.length; i < len; i++) {
                if (chunks[i].name !== this.entry) {
                    const files = chunks[i].files;
                    files.forEach((file): void => {
                        if (isJsFile(file)) {
                            const { beforeContent, afterContent } = getWrap(this.microName, this.beforeContent, this.afterContent);
                            compilation.assets[file] = new ConcatSource(beforeContent, compilation.assets[file], afterContent);
                        }
                    });
                }
            }
            next();
        });
    }
}