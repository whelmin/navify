const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

let isProd = process.env.NODE_ENV === 'production';

// 解析路径
const resovle = (...dir) => path.join(__dirname, ...dir);

// webpack config
const getWebpackConfig = () => ({
    entry: resovle('src/index.js'),
    output: {
        path: resovle('dist'),
        filename: `navify${isProd ? '.min' : ''}.js`,
        library: 'navify',
        libraryTarget: 'umd', // 输出格式
        umdNamedDefine: true,
    },
    resolve: {
        // 补全扩展名
        extensions: ['.js', '.vue'],
        // 别名
        alias: {
            '@': resovle('src'),
            vue$: 'vue/dist/vue.esm.js', // 运行时构建支持template模版编译
        },
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: { loader: 'babel-loader' },
                include: [resovle('src')]
            },
            {
                test: /\.vue/,
                use: { loader: 'vue-loader' }
            },
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: 'vue-style-loader' },
                    { loader: 'css-loader' + (isProd ? '?minimize' : '') },
                    { loader: 'postcss-loader' },
                    { loader: 'less-loader' },
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    { loader: 'url-loader'},
                    ...(isProd ? [{
                        // 压缩图片：https://github.com/tcoopman/image-webpack-loader
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true
                        }
                    }] : [])
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: { loader: 'url-loader' }
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin(),
        new VueLoaderPlugin(),
        ...(isProd ? [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: { comments: false }
                }
            }),
        ] : [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ])
    ],
    devServer: {
        port: 8520, // 开发端口
        contentBase: resovle('test'), // 本地服务器加载页面目录
        publicPath: '/dist/', // 打包文件路径
        inline: true, // 实时刷新
        hot: true, // 开启热模块替换
        quiet: true, // 开启friendly-errors-webpack-plugin
        overlay: { // 开启页面报错笼罩
            warnings: false,
            errors: true,
        },
        historyApiFallback: false, // History模式路由
    }
});

module.exports = (env, argv) => {
    isProd = argv.mode === 'production';
    return getWebpackConfig();
};
