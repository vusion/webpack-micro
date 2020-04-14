"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_sources_1 = require("webpack-sources");
function getWrap(microName, beforeContent, afterContent) {
    var alias = "window[\"" + microName + "\"]";
    beforeContent = beforeContent || ";(function(window,console,setTimeout,setInterval){\n ";
    afterContent = afterContent || "\n}).bind(" + alias + "._window)(" + alias + "._window," + alias + "._console," + alias + "._setTimeout," + alias + "._setInterval);";
    return {
        beforeContent: "if (" + alias + "._window && " + alias + "._window.microApp) {" + alias + "._window.microApp.isWrapRunning = true;};" + beforeContent,
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
        this.microName = options.microName;
        this.beforeContent = options.beforeContent;
        this.afterContent = options.afterContent;
        this.entry = options.entry || 'micro';
        if (Number(!!this.beforeContent) + Number(!!this.afterContent) === 1) {
            throw new TypeError('beforeContent afterContent is required');
        }
    }
    WrapMicroPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync('WrapMicroPlugin', function (compilation, next) {
            var chunks = compilation.chunks;
            for (var i = 0, len = chunks.length; i < len; i++) {
                if (chunks[i].name !== _this.entry) {
                    var files = chunks[i].files;
                    files.forEach(function (file) {
                        if (isJsFile(file)) {
                            var _a = getWrap(_this.microName, _this.beforeContent, _this.afterContent), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
                            compilation.assets[file] = new webpack_sources_1.ConcatSource(beforeContent, compilation.assets[file], afterContent);
                        }
                    });
                }
            }
            next();
        });
    };
    return WrapMicroPlugin;
}());
exports.default = WrapMicroPlugin;
