/*  LICENSE

_This file is Copyright 2018 by the Image Processing and Analysis Group (BioImage Suite Team). Dept. of Radiology & Biomedical Imaging, Yale School of Medicine._

BioImage Suite Web is licensed under the Apache License, Version 2.0 (the "License");

- you may not use this software except in compliance with the License.
- You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

__Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.__

ENDLICENSE */

"use strict";

const path=require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const basedir=path.resolve(path.join(__dirname,'..'));
const indir=path.resolve(path.join(basedir,'src'));
const outdir=path.resolve(path.join(basedir, path.join('build','web')));

console.log('++++');
console.log('++++ Webpack basedir =',basedir);
console.log('++++         indir   =',indir);
console.log('++++         outdir  =',outdir);
console.log('++++');

module.exports = {
    module: {
        rules: [
          {
            // Transpiles ES6-8 into ES5
            test: /\.js$/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            // Loads the javacript into html template provided.
            // Entry point is set below in HtmlWebPackPlugin in Plugins 
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: { minimize: true }
              }
            ]
          },
          {
            // Loads images into CSS and Javascript files
            test: /\.jpg$/,
            use: [{loader: 'url-loader'}]
          },
          {
            // Loads CSS into a file when you import it via Javascript
            // Rules are set in MiniCssExtractPlugin
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
        ]
      },
    plugins: [
    new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
    ],
    mode : 'production',
    entry : path.join(indir,'index.js'),
    output : {
        path : outdir,
        filename : 'index_bundle.js',
    },
    target : "web",
    externals: {
        "jquery": "jQuery", // require("jquery") is external and available on the global var jQuery
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};


