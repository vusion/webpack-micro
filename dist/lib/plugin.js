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
            var values = Object.values(assets);
            values.forEach(function (item) {
                item.js && !Array.isArray(item.js) && (item.js = [item.js]);
                item.css && !Array.isArray(item.css) && (item.css = [item.css]);
            });
            var entryAssets = null;
            if (processOutput) {
                entryAssets = processOutput(assets);
                if (!assets.js || !assets.css) {
                    console.error("processOutput return data like\n{\n    js?: string[] | string;\n    css?: string[] | string;\n    [props: string]: string[] | string;\n}");
                }
            }
            else {
                if (values.length > 1) {
                    console.error("must have one entry. please handle it by processOutput");
                }
                entryAssets = values[0];
            }
            if (options.record) {
                var recordData_1 = {
                    version: commitId,
                    assets: JSON.stringify(entryAssets),
                    microAppId: options.micro.app.id,
                    description: options.micro.app.description,
                };
                micro_1.default.recordSupAppVersion(recordData_1).then(function () {
                    console.log('record version success');
                    if (options.record) {
                        var refreshData_1 = {
                            microId: options.micro.id,
                            microVersion: options.micro.version,
                            microAppVersion: commitId,
                            microAppId: options.micro.app.id,
                        };
                        micro_1.default.refreshAppVersion(refreshData_1).then(function () {
                            console.error('refresh version success');
                        }, function () {
                            console.error('refresh version fail');
                            console.log(JSON.stringify(refreshData_1, null, 4));
                        });
                    }
                }, function () {
                    console.error('record version fail');
                    console.log(JSON.stringify(recordData_1, null, 4));
                });
            }
            return JSON.stringify(assets);
        }, _this = _super.call(this, options) || this;
        return _this;
    }
    return Micro;
}(assets_webpack_plugin_1.default));
exports.default = Micro;
