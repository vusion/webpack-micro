"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_sources_1 = require("webpack-sources");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function getWrap(microName, content, isEntry, beforeContent, afterContent) {
    var alias = "window[\"" + microName + "\"]";
    beforeContent = beforeContent || ";(function(window,console,setTimeout,setInterval){\n ";
    afterContent = afterContent || "\n})(" + alias + "._window," + alias + "._console," + alias + "._setTimeout," + alias + "._setInterval);";
    if (isEntry) {
        beforeContent = ";(function(){var a=window.microName; window.microName=\"" + microName + "\";" + content + ";window.microName=a;})();" + alias + "=window.microApp;if (" + alias + "._window && " + alias + "._window.microApp) {" + alias + "._window.microApp.isWrapRunning = true;}" + beforeContent;
    }
    return {
        beforeContent: beforeContent,
        afterContent: afterContent + (";if (" + alias + "._window && " + alias + "._window.microApp) {" + alias + "._window.microApp.isWrapRunning = false;} \n"),
    };
}
var isJsFile = function (str) {
    return str.endsWith('.js');
};
var WrapMicroPlugin = /** @class */ (function () {
    function WrapMicroPlugin(options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        var libPath = options.lib || path_1.default.join(process.cwd(), './node_modules/vusion-micro-app/dist/es5.js');
        this.content = fs_1.default.readFileSync(libPath).toString();
        this.microName = options.microName;
        this.beforeContent = options.beforeContent;
        this.afterContent = options.afterContent;
        if (Number(!!this.beforeContent) + Number(!!this.afterContent) === 1) {
            throw new TypeError('beforeContent afterContent is required');
        }
    }
    WrapMicroPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync('WrapMicroPlugin', function (compilation, next) {
            var chunks = compilation.chunks;
            var entries = [];
            compilation.entrypoints.forEach(function (item, k) {
                entries.push(k);
            });
            var _loop_1 = function (i, len) {
                var files = chunks[i].files;
                var distChunk = files[0];
                var isEntry = entries.includes(chunks[i].name);
                if (isJsFile(distChunk)) {
                    var _a = getWrap(_this.microName, _this.content, isEntry, _this.beforeContent, _this.afterContent), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                    compilation.assets[distChunk] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
                }
                files.slice(1).forEach(function (item) {
                    if (isJsFile(item)) {
                        var _a = getWrap(_this.microName, _this.content, isEntry, _this.beforeContent, _this.afterContent), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                        compilation.assets[item] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[item], afterContent);
                    }
                });
            };
            for (var i = 0, len = chunks.length; i < len; i++) {
                _loop_1(i, len);
            }
            next();
        });
    };
    return WrapMicroPlugin;
}());
exports.default = WrapMicroPlugin;
