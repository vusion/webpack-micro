"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(_a) {
    var template = _a.template;
    var lockKeys = ['window', 'self'];
    return {
        visitor: {
            Identifier: function (path, state) {
                if (!path.scope.hasOwnBinding(path.node.name) && !path.scope.hasBinding(path.node.name)) {
                    if (path.parent.type !== 'MemberExpression' && !lockKeys.includes(path.node.name)) {
                        path.node.name = "window[\"" + path.node.name + "\"]";
                    }
                }
            },
            MemberExpression: function (path, state) {
                if (!path.scope.hasOwnBinding(path.node.object.name) && !path.scope.hasBinding(path.node.object.name)) {
                    if (!lockKeys.includes(path.node.object.name)) {
                        path.node.object.name = "window[\"" + path.node.object.name + "\"]";
                    }
                }
            },
        },
    };
}
exports.default = default_1;
