const path = require('path')
// const nodeExternals = require('webpack-node-externals')
const htmlPlugin=require('html-webpack-plugin')
const miniCss=require('mini-css-extract-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }
  return opts
}
module.exports={
  mode: "development",
  target: 'node', 
  externals: {
    react: 'react',
  }
 , 
  module:{
    rules:[
      {
        test: /\.js$/, 
        // exclude: /node_modules/, 
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
        test: /\.(png|jpg|gif|ico)$/,
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