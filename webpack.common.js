const path = require('path');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/content/content.js',
   },
   plugins: [
     new CleanWebpackPlugin()
   ],
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };