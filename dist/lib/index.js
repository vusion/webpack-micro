"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var babel_1 = __importDefault(require("./babel"));
exports.babel = babel_1.default;
var wrap_1 = __importDefault(require("./wrap"));
exports.wrap = wrap_1.default;
var plugin_1 = __importDefault(require("./plugin"));
exports.plugin = plugin_1.default;
var newPlugin_1 = __importDefault(require("./newPlugin"));
exports.newPlugin = newPlugin_1.default;
var global_babel_1 = __importDefault(require("./global.babel"));
exports.global = global_babel_1.default;
var micro_1 = __importDefault(require("./micro"));
exports.helper = micro_1.default;
