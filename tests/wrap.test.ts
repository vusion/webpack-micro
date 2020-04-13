import compiler from './compiler';
// demo
test('important window in global2', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
    }, {
        microName: 'test',
    });
    const output = stats.compilation.assets['main.js'].source();
    expect(true).toBe(output.trim().startsWith(`if (window["test"]._window && window["test"]._window.microApp) {window["test"]._window.microApp.isWrapRunning = true;};;(function(window,console,setTimeout,setInterval){`));
    expect(true).toBe(output.trim().endsWith(`}).bind(window["test"]._window)(window["test"]._window,window["test"]._console,window["test"]._setTimeout,window["test"]._setInterval);;if (window["test"]._window && window["test"]._window.microApp) {window["test"]._window.microApp.isWrapRunning = false;}`));
});
