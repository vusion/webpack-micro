import compiler from './compiler';

test('important window in global', async (): Promise<void> => {
    const stats = await compiler('tmp/main.js');
    const p = stats.toJson().modules.find((item): boolean => item.name.endsWith('tmp/main.js'));
    const output = p.source;
    expect(output).toBe(`import { _window as window, _console as console, _setTimeout as setTimeout, _setInterval as setInterval, _document as document } from 'vusion-micro-app'\nwindow.a = 1;`);
});
test('test addon', async (): Promise<void> => {
    const stats = await compiler('tmp/main.js', {
        addon: {
            text: `import window1 from 'vusion-micro-app'`,
        },
    });
    const p = stats.toJson().modules.find((item): boolean => item.name.endsWith('tmp/main.js'));
    const output = p.source;
    expect(output).toBe(`import { _window as window, _console as console, _setTimeout as setTimeout, _setInterval as setInterval, _document as document } from 'vusion-micro-app'\nimport window1 from 'vusion-micro-app'\nwindow.a = 1;`);
});
test('test addon replace', async (): Promise<void> => {
    const stats = await compiler('tmp/test.js', {
        addon: {
            replace: true,
            text: `import window1 from 'vusion-micro-app'`,
        },
    });
    const p = stats.toJson().modules.find((item): boolean => item.name.endsWith('tmp/test.js'));
    const output = p.source;
    expect(output).toBe(`import window1 from 'vusion-micro-app'\nwindow.a = 1;`);
});

test('test ignore', async (): Promise<void> => {
    const stats = await compiler('tmp/test.js', {
        ignore: ['test.js'],
        addon: {
            replace: true,
            text: `import window1 from 'vusion-micro-app'`,
        },
    });
    const p = stats.toJson().modules.find((item): boolean => item.name.endsWith('tmp/test.js'));
    const output = p.source;
    expect(output).toBe(`window.a = 1;`);
});