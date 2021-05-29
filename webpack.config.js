const path = require('path')
const htmlPlugin=require('html-webpack-plugin')
const miniCss=require('mini-css-extract-plugin')

module.exports={
  mode: "development",
  module:{
    rules:[
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: [{
          loader: 'babel-loader'
        }
      ]
      },
      {
        test: /\.(css)$/,
        use:[miniCss.loader,'css-loader']
      },
      {
        test: /\.(png|jpg|svg|ico)$/,
        use:[{loader: 'file-loader',
        options:{
          outputPath: 'images',
          name: '[name]-[sha1:hash:7].[ext]'
        }}]
      }
    ]
  }, 
  plugins:[
    new htmlPlugin({template: 'public/index.html'}),
    new miniCss({filename: 'main-[hash:8].css'})
  ],
  devServer: {
    host: 'localhost',
    port: 8880,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8881',
        secure: false
      }
    }
  },
  
}