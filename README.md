# PDF Cutter

PDF Cutter is easy-to-use chrome extension. It detects PDF file opened in browser and creates new one containing only pages with highlighted text. PDF extension does not contain server-side and don't require any internet connection. 
## Building
Install all the necessary libraries: 
``
npm install
``
To build the development version of extension type:
``
npm run build
``
## Dependecies
The extension uses `pdf-lib` JavaScript library to load, create and modify PDF documents. For building bundles it creates `webpack`.
