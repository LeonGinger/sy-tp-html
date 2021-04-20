const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}


module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: process.env.outputDir,
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
            config.externals = {
                vue: "Vue",
                vuex: "Vuex",
                "vue-router": "VueRouter",
                "element-ui": "ELEMENT"
            };
        } else {
            // 为开发环境修改配置...

        }
    },
    /*mock和线上接口同时使用*/
    devServer: {
        port: 8081,
        open: true,
        https:false,
        host: '0.0.0.0',
        overlay: {
          warnings: false,
          errors: true,
        },
        // before: app => {
        //     require('mockjs');
        // },
        proxy: {
            '/web': {
                target: 'http://sy.zsicp.com',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                  '^/web': ''
                }
            }
          // [process.env.VUE_APP_BASE_API]: {
          //   target: 'http://sy.zsicp.com',
          //   changeOrigin: true,
          //   pathRewrite: {
          //     ['^' + process.env.VUE_APP_BASE_API]: ''
          //   }
          // }
        },
        after:app=>{require('mockjs')},
      },
      pluginOptions: { // 第三方插件配置
           'style-resources-loader': {
             preProcessor: 'less',
             patterns: [path.resolve(__dirname, 'src/assets/styles/base.less')] // less所在文件路径
           }
        },

    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].template = process.env.template;
            return args;
        });
    },

};
