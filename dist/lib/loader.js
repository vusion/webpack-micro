"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var loader_utils_1 = __importDefault(require("loader-utils"));
var path_1 = __importDefault(require("path"));
var ignore_1 = __importDefault(require("ignore"));
function default_1(source) {
    var options = Object.assign({}, loader_utils_1.default.getOptions(this));
    var wrap = "import { _window as window, _console as console, _setTimeout as setTimeout, _setInterval as setInterval, _document as document } from 'vusion-micro-app'";
    if (options.addon) {
        if (options.addon.replace) {
            wrap = options.addon.text;
        }
        else {
            wrap += ('\n' + (options.addon.text ? options.addon.text : options.addon));
        }
    }
    wrap += '\n';
    if (options.ignore) {
        var ig = ignore_1.default().add(__spreadArrays(['vusion-micro-app/**'], options.ignore));
        if (ig.ignores(path_1.default.relative(this.rootContext, this.resourcePath))) {
            wrap = '';
        }
    }
    return wrap + source;
}
exports.default = default_1;
