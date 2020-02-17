import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture: string, options?: object): Promise<any> => {
    const compiler = webpack({
        mode: 'development',
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: [
                    {
                        loader: path.resolve(__dirname, '../dist/lib/loader.js'),
                        options,
                    },
                    // {
                    //     loader: 'babel-loader'
                    // }
                ],
            }]
        },
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject): void => {
        compiler.run((err, stats): void => {
            if (err) reject(err);
            if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

            resolve(stats);
        });
    });
};