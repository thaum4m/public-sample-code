const path = require('path')

module.exports = {
        entry: ['babel-polyfill', './src/'],
        output: {
                filename: 'main.js',
                path: path.resolve(__dirname, 'dist')
        },
        resolve: {
                extensions: ['.ts', '.tsx', '.js']
        },
        module: {
                rules: [
                        // All files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                        {
                                test: /\.tsx?$/,
                                exclude: /(node_modules|bower_components)/,
                                loader: 'ts-loader'
                        },
                        {
                                test: /\.js$/,
                                exclude: /(node_modules|bower_components)/,
                                use: {
                                        loader: 'babel-loader',
                                }
                        }
                ]
        }
}
