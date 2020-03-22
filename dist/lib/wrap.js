"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_sources_1 = require("webpack-sources");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function getWrap(microName, content, isEntry) {
    var alias = "window[\"" + microName + "\"]";
    var beforeContent = ';(function(window,console,setTimeout,setInterval){\n return ';
    var afterContent = "\n})(window.microApp._window,window.microApp._console,window.microApp._setTimeout,window.microApp._setInterval);";
    if (isEntry) {
        beforeContent = content + ";if (window.microApp.microApp){window.microApp.microApp.microName=\"" + microName + "\";}" + alias + "=window.microApp" + beforeContent;
    }
    return {
        beforeContent: beforeContent,
        afterContent: afterContent,
    };
}
var WrapMicroPlugin = /** @class */ (function () {
    function WrapMicroPlugin(options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        var libPath = options.lib || path_1.default.join(process.cwd(), './node_modules/vusion-micro-app/dist/es5.js');
        this.content = fs_1.default.readFileSync(libPath).toString();
        this.microName = options.microName;
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
                var _a = getWrap(_this.microName, _this.content, isEntry), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                compilation.assets[distChunk] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
                files.slice(1).forEach(function (item) {
                    var _a = getWrap(_this.microName, _this.content, isEntry), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                    compilation.assets[item] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[item], afterContent);
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
