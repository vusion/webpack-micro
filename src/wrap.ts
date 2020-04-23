import { ConcatSource } from 'webpack-sources';
interface Options {
    microName: string;
    entry: string;
}
interface Wrap {
    beforeContent: string;
    afterContent: string;
}
function getWrap(microName): Wrap {
    const beforeContent = `;(function(self){with(self){\n`;
    const afterContent = `\n}}).call(_w,_w);`;
    const worker = `if(!self.document){_w=self;}`;
    return {
        beforeContent: ';(function(_p) {var _w=_p._window||self;' + worker + `if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};` + beforeContent,
        afterContent: afterContent + `;if (_w && _w.microApp) {_w.microApp.isWrapRunning=false;}})(self["${microName}"]);`,
    };
}
const isJsFile = function (str): boolean {
    return str.endsWith('.js');
};
export default class WrapMicroPlugin {
    private microName: string;
    private entry: string;
    public constructor(options: Options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        this.microName = options.microName;
        this.entry = options.entry || 'micro';
    }
    public apply(compiler): void {
        compiler.hooks.emit.tapAsync('WrapMicroPlugin', (compilation, next): void => {
            const chunks = compilation.chunks;
            for (let i = 0, len = chunks.length; i < len; i++) {
                if (chunks[i].name !== this.entry) {
                    const files = chunks[i].files;
                    files.forEach((file): void => {
                        if (isJsFile(file)) {
                            const { beforeContent, afterContent } = getWrap(this.microName);
                            compilation.assets[file] = new ConcatSource(beforeContent, compilation.assets[file], afterContent);
                        }
                    });
                }
            }
            next();
        });
    }
}