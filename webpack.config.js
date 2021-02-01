const path = require('path');
 
module.exports = {
    entry: './src/content/content.js',
    mode: 'development',
    entry: {
        index: './src/content/content.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
