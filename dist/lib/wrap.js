"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_sources_1 = require("webpack-sources");
function getWrap(microName, beforeContent, afterContent) {
    beforeContent = beforeContent || ";(function(window,self,console,setTimeout,setInterval){with(window){\n";
    afterContent = afterContent || "\n}}).call(_w,_w,_w,_p._console,_p._setTimeout,_p._setInterval);";
    var worker = "if(!self.document){self._window=self;self._console=console;self._setTimeout=setTimeout;self._setInterval=setInterval;}";
    return {
        beforeContent: ';(function(_p) {var _w=_p._window;' + worker + "if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};" + beforeContent,
        afterContent: afterContent + ";if (_w && _w.microApp) {_w.microApp.isWrapRunning = false;} \n" + ("})(self[\"" + microName + "\"] || self)"),
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
