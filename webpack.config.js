const path = require('path')
// const nodeExternals = require('webpack-node-externals')
const htmlPlugin=require('html-webpack-plugin')
const miniCss=require('mini-css-extract-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    // new CleanWebpackPlugin(),
  ],
  devServer:{
    open:true
  }
  
}