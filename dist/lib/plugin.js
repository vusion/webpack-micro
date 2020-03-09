"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var micro_1 = __importDefault(require("./micro"));
var assets_webpack_plugin_1 = __importDefault(require("assets-webpack-plugin"));
var getCommitId = function () {
    try {
        return shelljs_1.default.exec('git rev-parse HEAD').trim();
    }
    catch (error) {
        console.error(error);
        throw new Error('get commitId error.');
    }
};
var Micro = /** @class */ (function (_super) {
    __extends(Micro, _super);
    function Micro(options) {
        var _this = this;
        options.fullPath = true;
        options.entrypoints = true;
        var commitId = options.commitId;
        if (!commitId) {
            commitId = options.commitId = getCommitId();
        }
        options.filename = commitId + ".json";
        if (!options.path) {
            options.path = path.join(process.cwd(), options.micro.app.name);
        }
        var processOutput = options.processOutput;
        options.processOutput = function (assets) {
            Object.values(assets).forEach(function (item) {
                item.js && !Array.isArray(item.js) && (item.js = [item.js]);
                item.css && !Array.isArray(item.css) && (item.css = [item.css]);
            });
            if (processOutput) {
                processOutput(assets);
            }
            if (options.record) {
                micro_1.default.recordSupAppVersion({
                    version: commitId,
                    assets: JSON.stringify(assets),
                    microAppId: options.micro.app.id,
                    description: options.micro.app.description,
                }).then(function () {
                    console.log('record version success');
                    if (options.record) {
                        micro_1.default.refreshAppVersion({
                            microId: options.micro.id,
                            microVersion: options.micro.version,
                            microAppVersion: commitId,
                            microAppId: options.micro.app.id,
                        }).then(function () {
                            console.error('refresh version success');
                        }, function () {
                            console.error('refresh version fail');
                        });
                    }
                }, function () {
                    console.error('record version fail');
                });
            }
            return JSON.stringify(assets);
        }, _this = _super.call(this, options) || this;
        return _this;
    }
    return Micro;
}(assets_webpack_plugin_1.default));
exports.default = Micro;