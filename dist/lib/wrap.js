"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var WrapMicroPlugin = /** @class */ (function () {
    function WrapMicroPlugin(options) {
        if (!options.microName) {
            throw new TypeError('microName is required');
        }
        this.microName = options.microName;
        this.entry = options.entry || 'micro';
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
                            var _a = getWrap(_this.microName), beforeContent = _a.beforeContent, afterContent = _a.afterContent;
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
