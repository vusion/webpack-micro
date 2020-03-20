import compiler from './compiler';
// demo
test('important window in global2', async (): Promise<void> => {
    const stats = await compiler({
        main: './tmp/main.js',
        test: ['./tmp/test.js', './tmp/a.js'],
    });
    // console.log(stats.toJson());s
});
