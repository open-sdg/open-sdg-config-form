const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const buildPathParts = [__dirname, 'dist'];
    if (env && env.tag && env.tag !== 'main') {
        buildPathParts.push(env.tag);
    }
    return {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: buildPathParts.join('/'),
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: './src/index.html',
            })
        ],
        module: {
            rules: [
                {
                    test: /.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        }
                    }
                }
            ]
        }
    }
}
