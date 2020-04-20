import compiler from './compiler';
// demo
test('important window in proxyWindow', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
    }, {
        microName: 'test',
    });
    const output = stats.compilation.assets['main.js'].source();
    expect(true).toBe(output.trim().startsWith(`if(!self.document){self["test"]=self;self._window=self;self._console=console;self._setTimeout=setTimeout;self._setInterval=setInterval;}if (self["test"]._window && self["test"]._window.microApp) {self["test"]._window.microApp.isWrapRunning = true;};;(function(window,self,console,setTimeout,setInterval){with(window){`));
    expect(true).toBe(output.trim().endsWith(`}}).call(self["test"]._window, self["test"]._window,self["test"]._window,self["test"]._console,self["test"]._setTimeout,self["test"]._setInterval);;if (self["test"]._window && self["test"]._window.microApp) {self["test"]._window.microApp.isWrapRunning = false;}`));
});

test('ignore entry', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
    }, {
        microName: 'test',
        entry: 'main',
    });
    const output = stats.compilation.assets['main.js'].source();
    expect(false).toBe(output.trim().startsWith(`if(!window.document){window["test"]=window;window._window=_window;window._console=console;window._setTimeout=setTimeout;window._setInterval=setInterval;}if (window["test"]._window && window["test"]._window.microApp) {window["test"]._window.microApp.isWrapRunning = true;};;(function(window,self,console,setTimeout,setInterval){`));
    expect(false).toBe(output.trim().endsWith(`}).bind(window["test"]._window)(window["test"]._window,window["test"]._window,window["test"]._console,window["test"]._setTimeout,window["test"]._setInterval);;if (window["test"]._window && window["test"]._window.microApp) {window["test"]._window.microApp.isWrapRunning = false;}`));
});
