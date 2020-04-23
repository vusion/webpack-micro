import compiler from './compiler';
// demo
test('important window in proxyWindow', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
    }, {
        microName: 'test',
    });
    const output = stats.compilation.assets['main.js'].source();
    expect(true).toBe(output.trim().startsWith(`;(function(_p) {var _w=_p._window||self;if(!self.document){_w=self;}if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};;(function(self){with(self){`));
    expect(true).toBe(output.trim().endsWith(`}}).call(_w,_w);;if (_w && _w.microApp) {_w.microApp.isWrapRunning=false;}})(self["test"]);`));
});

test('ignore entry', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
    }, {
        microName: 'test',
        entry: 'main',
    });
    const output = stats.compilation.assets['main.js'].source();
    expect(false).toBe(output.trim().startsWith(`;(function(_p) {var _w=_p._window||self;if(!self.document){_w=self;}if (_w && _w.microApp) {_w.microApp.isWrapRunning = true;};;(function(self){with(self){`));
    expect(false).toBe(output.trim().endsWith(`}}).call(_w,_w);;if (_w && _w.microApp) {_w.microApp.isWrapRunning=false;}})(self["test"]);`));
});
