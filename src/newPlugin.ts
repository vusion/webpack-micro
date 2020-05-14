const PLUGIN_NAME = 'MicroPlugin';
import webpack from 'webpack';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ConcatSource } from 'webpack-sources';
interface Options {
    latest: boolean;
    prefix: string;
    filename: string;
    entryName: string;
    microName: string;
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
export default class MicroPlugin {
    public options: Options;
    public constructor(options: Options) {
        this.options = Object.assign({
            entryName: 'micro',
        }, options);
    }

    public apply(compiler): void {
        const self = this;
        compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation, childProcessDone): void => {
            const outputOptions = compiler.options.output;
            const childCompiler = compilation.createChildCompiler(PLUGIN_NAME, {
                ...outputOptions,
                filename: outputOptions.filename.replace(/\[(.*?)\]/g, `child`),
            }, [
                new webpack.DefinePlugin({
                    MICRO_NAME: JSON.stringify(self.options.microName),
                }),
            ]);
            childCompiler.context = compiler.context;

            new SingleEntryPlugin(compiler.context, './node_modules/vusion-micro-app/dist/index.js', this.options.entryName).apply(
                childCompiler,
            );
            childCompiler.runAsChild((err, entries, childCompilation): void => {
                if (err) {
                    return childProcessDone(err);
                }

                if (childCompilation.errors.length > 0) {
                    return childProcessDone(childCompilation.errors[0]);
                }
                compilation.chunks.push(...childCompilation.chunks);
                childProcessDone();
            });
        });
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation): void => {
            if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(PLUGIN_NAME, (htmlPluginData, callback): void => {
                    self.recordAssets(compilation, htmlPluginData.assets);
                    callback(null, htmlPluginData);
                });
            } else {
                // HtmlWebPackPlugin 4.x
                const hooks = HtmlWebpackPlugin.getHooks(compilation);
                hooks["htmlWebpackPluginBeforeHtmlGeneration"].tapAsync(PLUGIN_NAME, (htmlPluginData, callback): void => {
                    self.recordAssets(compilation, htmlPluginData.assets);
                    callback(null, htmlPluginData);
                });
            }
        });
        compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, next): void => {
            const chunks = compilation.chunks;
            for (let i = 0, len = chunks.length; i < len; i++) {
                if (chunks[i].name !== this.options.entryName) {
                    const files = chunks[i].files;
                    files.forEach((file): void => {
                        if (isJsFile(file)) {
                            const { beforeContent, afterContent } = getWrap(this.options.microName);
                            compilation.assets[file] = new ConcatSource(beforeContent, compilation.assets[file], afterContent);
                        }
                    });
                }
            }
            next();
        });
    }

    public recordAssets(compilation, data): void {
        const microData = {
            css: data.css,
            js: data.js,
        };
        const output = JSON.stringify(microData);
        const outputJS = `;(function(){
            var m=window.micro=window.micro||{};
            var c=m.subApps=m.subApps||{};
            c["${this.options.microName}"]=${output};
            m.subApps=c;})();`;
        const tmp = compilation.assets[`${this.options.prefix}${this.options.filename}.json`] = {
            source: (): string => output,
            size: (): number => output.length,
        };
        const tmpJS = compilation.assets[`${this.options.prefix}${this.options.filename}.js`] = {
            source: (): string => outputJS,
            size: (): number => outputJS.length,
        };
        if (this.options.latest) {
            compilation.assets[`${this.options.prefix}latest.json`] = tmp;
            compilation.assets[`${this.options.prefix}latest.js`] = tmpJS;
        }
    }
}
