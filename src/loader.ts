import loaderUtils from 'loader-utils';
import path from 'path';
import ignore from 'ignore';
export default function (source): string {
    const options = Object.assign({}, loaderUtils.getOptions(this));
    let wrap = `import { _window as window, _console as console, _setTimeout as setTimeout, _setInterval as setInterval, _document as document } from 'vusion-micro-app'`;
    if (options.addon) {
        if (options.addon.replace) {
            wrap = options.addon.text;
        } else {
            wrap += ('\n' + (options.addon.text ? options.addon.text : options.addon));
        }
    }
    wrap += '\n';
    if (options.ignore) {
        const ig = ignore().add(['vusion-micro-app/**', ...options.ignore]);
        if (ig.ignores(path.relative(this.rootContext, this.resourcePath))) {
            wrap = '';
        }
    }
    return wrap + source;
}