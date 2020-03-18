"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(_a) {
    var t = _a.types, template = _a.template;
    var injectList = ['window', 'console', 'setTimeout', 'document', 'setInterval'];
    return {
        visitor: {
            Program: function (path, state) {
                if (state.file.opts.filename.includes('vusion-micro-app')) {
                    return;
                }
                var injectKeys = injectList.filter(function (item) {
                    return !(path.scope.hasOwnBinding(item) || path.scope.hasBinding(item));
                });
                var body = path.get('body');
                var isModule = body.find(function (item) {
                    return ['ExportNamedDeclaration', 'ExportDefaultDeclaration', 'ImportDeclaration'].includes(item.type);
                });
                if (injectKeys && injectKeys.length) {
                    var importList = injectKeys.map(function (key) { return "_" + key + " as " + key; });
                    var moduleList = injectKeys.map(function (key) { return "_" + key + " : " + key; });
                    var myImport = isModule ? template("import {" + importList.join(',') + "} from \"vusion-micro-app\";", { sourceType: "module" }) :
                        template("const {" + moduleList.join(',') + "} = require(\"vusion-micro-app\");", { sourceType: "script" });
                    if (body && body.length) {
                        body[0].insertBefore(myImport());
                    }
                }
            }
        },
    };
}
exports.default = default_1;
