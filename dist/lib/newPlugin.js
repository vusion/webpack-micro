"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PLUGIN_NAME = 'MicroPlugin';
var webpack_1 = __importDefault(require("webpack"));
var SingleEntryPlugin_1 = __importDefault(require("webpack/lib/SingleEntryPlugin"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var webpack_sources_1 = require("webpack-sources");
function getWrap(microName) {
    var beforeContent = ";(function(self){with(self){\n";
    var afterContent = "\n}}).call(_w,_w);";
    var worker = "if(!self.document){_w=self;}";
    return {
        beforeContent: ';(function(_p) {var _w=_p._window||self;' + worker + "if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};" + beforeContent,
        afterContent: afterContent + (";if (_w && _w.microApp) {_w.microApp.isWrapRunning=false;}})(self[\"" + microName + "\"]);"),
    };
}
var isJsFile = function (str) {
    return str.endsWith('.js');
};
var MicroPlugin = /** @class */ (function () {
    function MicroPlugin(options) {
        this.options = Object.assign({
            entryName: 'micro',
        }, options);
    }
    MicroPlugin.prototype.apply = function (compiler) {
        var _this = this;
        var self = this;
        compiler.hooks.make.tapAsync(PLUGIN_NAME, function (compilation, childProcessDone) {
            var outputOptions = compiler.options.output;
            var childCompiler = compilation.createChildCompiler(PLUGIN_NAME, __assign(__assign({}, outputOptions), { filename: outputOptions.filename.replace(/\[(.*?)\]/g, "child") }), [
                new webpack_1.default.DefinePlugin({
                    MICRO_NAME: JSON.stringify(self.options.microName),
                }),
            ]);
            childCompiler.context = compiler.context;
            new SingleEntryPlugin_1.default(compiler.context, './node_modules/vusion-micro-app/dist/index.js', _this.options.entryName).apply(childCompiler);
            childCompiler.runAsChild(function (err, entries, childCompilation) {
                var _a;
                if (err) {
                    return childProcessDone(err);
                }
                if (childCompilation.errors.length > 0) {
                    return childProcessDone(childCompilation.errors[0]);
                }
                (_a = compilation.chunks).push.apply(_a, childCompilation.chunks);
                childProcessDone();
            });
        });
        compiler.hooks.compilation.tap(PLUGIN_NAME, function (compilation) {
            if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(PLUGIN_NAME, function (htmlPluginData, callback) {
                    self.recordAssets(compilation, htmlPluginData.assets);
                    callback(null, htmlPluginData);
                });
            }
            else {
                // HtmlWebPackPlugin 4.x
                var hooks = html_webpack_plugin_1.default.getHooks(compilation);
                hooks["htmlWebpackPluginBeforeHtmlGeneration"].tapAsync(PLUGIN_NAME, function (htmlPluginData, callback) {
                    self.recordAssets(compilation, htmlPluginData.assets);
                    callback(null, htmlPluginData);
                });
            }
        });
        compiler.hooks.emit.tapAsync(PLUGIN_NAME, function (compilation, next) {
            var chunks = compilation.chunks;
            for (var i = 0, len = chunks.length; i < len; i++) {
                if (chunks[i].name !== _this.options.entryName) {
                    var files = chunks[i].files;
                    files.forEach(function (file) {
                        if (isJsFile(file)) {
                            var _a = getWrap(_this.options.microName), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                            compilation.assets[file] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[file], afterContent);
                        }
                    });
                }
            }
            next();
        });
    };
    MicroPlugin.prototype.recordAssets = function (compilation, data) {
        var microData = {
            css: data.css,
            js: data.js,
        };
        var output = JSON.stringify(microData);
        var outputJS = ";(function(){\n            var m=window.micro=window.micro||{};\n            var c=m.subApps=m.subApps||{};\n            c[\"" + this.options.microName + "\"]=" + output + ";\n            m.subApps=c;})();";
        var tmp = compilation.assets["" + this.options.prefix + this.options.filename + ".json"] = {
            source: function () { return output; },
            size: function () { return output.length; },
        };
        var tmpJS = compilation.assets["" + this.options.prefix + this.options.filename + ".js"] = {
            source: function () { return outputJS; },
            size: function () { return outputJS.length; },
        };
        if (this.options.latest) {
            compilation.assets[this.options.prefix + "latest.json"] = tmp;
            compilation.assets[this.options.prefix + "latest.js"] = tmpJS;
        }
    };
    return MicroPlugin;
}());
exports.default = MicroPlugin;
