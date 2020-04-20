export default function({ template }): Record<string, any> {
    const lockKeys = ['window', 'self']
    return {
        visitor: {
            Identifier(path, state): void {
                if (!path.scope.hasOwnBinding(path.node.name) && !path.scope.hasBinding(path.node.name)) {
                    if (path.parent.type !== 'MemberExpression' && !lockKeys.includes(path.node.name)) {
                        path.node.name = `window["${path.node.name}"]`;
                    }
                }
            },
            MemberExpression(path, state): void {
                if (!path.scope.hasOwnBinding(path.node.object.name) && !path.scope.hasBinding(path.node.object.name)) {
                    if (!lockKeys.includes(path.node.object.name)) {
                        path.node.object.name = `window["${path.node.object.name}"]`;
                    }
                }
            },
        },
    }; 
}