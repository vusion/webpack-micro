export default function({ types: t, template }): Record<string, any> {
    const injectList = ['window', 'console', 'setTimeout', 'document', 'setInterval'];
    return {
        visitor: {
            Program(path, state): void {
                if (state.file.opts.filename.includes('vusion-micro-app')) {
                    return;
                }
                const injectKeys = injectList.filter((item): boolean => {
                    return !(path.scope.hasOwnBinding(item) || path.scope.hasBinding(item));
                });
                const body = path.get('body');
                const isModule = body.find((item): boolean => {
                    return [ 'ExportNamedDeclaration', 'ExportDefaultDeclaration', 'ImportDeclaration'].includes(item.type);
                });
                if (injectKeys && injectKeys.length) {
                    const importList = injectKeys.map((key): string => `_${key} as ${key}`);
                    const moduleList = injectKeys.map((key): string => `_${key} : ${key}`);
                    const myImport = isModule? template(`import {${importList.join(',')}} from "vusion-micro-app";`, { sourceType: "module" }):
                        template(`const {${moduleList.join(',')}} = require("vusion-micro-app");`, { sourceType: "script" });
                    
                    if (body && body.length) {
                        body[0].insertBefore(myImport());
                    }
                        
                }
            }
        
        },
    }; 
}