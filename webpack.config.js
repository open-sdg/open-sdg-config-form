const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    return {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: [__dirname, 'dist', env.tag].join('/'),
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
