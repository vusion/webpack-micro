"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ms_1 = require("vusion-api/out/ms");
var check = {
    recordSupAppVersion: function (params) {
        var version = params.version, assets = params.assets, microAppId = params.microAppId;
        if (!version || !assets || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
    refreshAppVersion: function (params) {
        var microId = params.microId, microVersion = params.microVersion, microAppVersion = params.microAppVersion, microAppId = params.microAppId;
        if (!microId || !microAppVersion || !microVersion || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
};
exports.default = {
    recordRefresh: function (params) {
        var _this = this;
        var result = check.recordSupAppVersion(params) || check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        return this.recordSupAppVersion(params).then(function () { return _this.refreshAppVersion(params); });
    },
    recordSupAppVersion: function (params) {
        var result = check.recordSupAppVersion(params);
        if (result) {
            return result;
        }
        var version = params.version, assets = params.assets, microAppId = params.microAppId, description = params.description;
        return ms_1.recordMicroAppVersion({
            version: version,
            assets: assets,
            description: description,
            microAppId: microAppId,
        });
    },
    refreshAppVersion: function (params) {
        var result = check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        var microId = params.microId, microVersion = params.microVersion, microAppVersion = params.microAppVersion, microAppId = params.microAppId;
        return ms_1.refreshMicroVersion({
            microId: microId,
            microVersion: microVersion,
            microAppVersion: microAppVersion,
            microAppId: microAppId,
        });
    },
};
