# PDF Shortener Extension

PDF Shortener is an easy-to-use Chrome extension. It detects a PDF file opened in a browser and creates a new one containing only pages with highlighted text. PDF extension does not contain server-side and doesn't require any internet connection. 
## Building
Install all the necessary libraries: 
``
npm install
``
To build the development version of extension type:
``
npm run build
``
## Dependencies
The extension uses the `pdf-lib` JavaScript library to load, create and modify PDF documents. For building bundles, it creates the `webpack` module.
