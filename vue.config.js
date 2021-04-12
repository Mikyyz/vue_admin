const path = require('path');
const { config } = require('process');


function resolve(dir) {
    return path.join(__dirname, dir)
}

//vue.config.js
module.exports = {
    configureWebpack: config => {
        //生产环境取消console.log
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                resolve('@/assets//common/global.less')
            ]
        }
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#1890FF',
                        'link-color': '#1890FF',
                        'border-radius-base': '4px',
                    },
                    javascriptEnabled: true,
                }
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
    // devServer: {
    //     open: true,//是否自动弹出浏览器页面
    //     hotOnly: false,//是否开启热更新
    //     contentBase: './',
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:3000',
    //             ws: true, //代理websockets
    //             changeOrigin: true, //虚拟站点需要更改origin
    //             pathRewrite: {//重写路径 比如/api/aaa/ccc重写为 /aaa/ccc
    //                 '^/api': ''
    //             }
    //         }
    //     }
    //     //proxy: 'http://localhost:3000'
    // }
}