const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 3000,
  },

  configureWebpack: {
    output: { filename: '[name].[hash].js' },
    resolve: {
      modules: ['./src'],
    },
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ['raw-loader', 'glslify-loader'],
        },
        // {
        //   test: /\.(glsl|vs|fs|vert|frag)$/,
        //   exclude: /node_modules/,
        //   use: [
        //     'raw-loader',
        //     {
        //       loader: 'glslify-loader',
        //       options: {
        //         transform: [
        //           ['glslify-hex', { }]
        //         ]
        //       }
        //     }
        //   ]
        // },
      ],
    },
  },
  lintOnSave: true,

  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @use "sass:list";
          @import "src/styles/global.scss";
        `,
      },
    },
  },
})
