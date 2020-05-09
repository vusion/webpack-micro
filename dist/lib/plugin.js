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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
        return shelljs_1.default.exec('git rev-parse HEAD', {
            silent: true
        }).trim();
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
        var entry = options.entry || 'micro';
        var commitId = options.commitId;
        if (!commitId) {
            commitId = options.commitId = getCommitId();
        }
        options.filename = options.filename || commitId + ".json";
        options.useCompilerPath = 'useCompilerPath' in options ? options.useCompilerPath : true;
        options.keepInMemory = 'keepInMemory' in options ? options.keepInMemory : true;
        if (!options.path) {
            options.path = path.join(process.cwd(), options.micro.app.name);
        }
        var processOutput = options.processOutput;
        options.processOutput = function (assets) {
            delete assets.js; // dev
            delete assets.css; // dev
            var microEntryAssets = assets[entry];
            delete assets[entry];
            var values = Object.values(assets);
            if (values.length > 1) {
                console.error('micro not support multi entry');
                process.exit(3);
            }
            values.forEach(function (item) {
                item.js && !Array.isArray(item.js) && (item.js = [item.js]);
                item.css && !Array.isArray(item.css) && (item.css = [item.css]);
                if (microEntryAssets) {
                    microEntryAssets.js && !Array.isArray(microEntryAssets.js) && (microEntryAssets.js = [microEntryAssets.js]);
                    item.js = __spreadArrays(microEntryAssets.js, item.js);
                }
            });
            var entryAssets = null;
            var microAssets = values[0];
            if (processOutput) {
                entryAssets = processOutput(microAssets);
                if (!microAssets.js || !microAssets.css) {
                    console.error("processOutput return data like\n{\n    js?: string[] | string;\n    css?: string[] | string;\n    [props: string]: string[] | string;\n}");
                }
            }
            if (options.record) {
                var recordData_1 = {
                    version: commitId,
                    assets: JSON.stringify(microAssets),
                    microAppId: options.micro.app.id,
                    description: options.micro.app.description,
                };
                micro_1.default.recordSupAppVersion(recordData_1).then(function () {
                    console.log('record version success');
                    if (options.refresh) {
                        var versions = options.micro.versions;
                        var version = options.micro.version;
                        if (version) {
                            versions = [version];
                        }
                        var refreshData_1 = {
                            microId: options.micro.id,
                            microAppVersion: commitId,
                            microAppId: options.micro.app.id,
                        };
                        Promise.all(versions.map(function (version) {
                            return micro_1.default.refreshAppVersion(Object.assign({
                                microVersion: version,
                            }, refreshData_1));
                        })).then(function () {
                            console.error('refresh version success');
                        }, function (e) {
                            console.error('refresh version fail', e);
                            console.log(JSON.stringify(refreshData_1, null, 4));
                            process.exit(2);
                        });
                    }
                }, function (e) {
                    console.error('record version fail', e);
                    console.log(JSON.stringify(recordData_1, null, 4));
                    process.exit(2);
                });
            }
            return entryAssets ? entryAssets : JSON.stringify(microAssets);
        };
        _this = _super.call(this, options) || this;
        return _this;
    }
    return Micro;
}(assets_webpack_plugin_1.default));
exports.default = Micro;
