import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';
import WrapMicroPlugin from '../src/wrap';
export default (entry, options?: object): Promise<any> => {
    const compiler = webpack({
        mode: 'development',
        context: __dirname,
        entry,
        output: {
            path: path.resolve(__dirname),
            filename: '[name].[hash].js',
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
            }]
        },
        plugins: [
            new WrapMicroPlugin({
                microName: 'test',
            })
        ],
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