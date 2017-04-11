module.export = function(env = {}) {
  const webpack = require('webpack'),
        path = require('path'),
        fs = require('fs'),
        packageConfig = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  let name = packageConfig.name,
      version = packageConfig.version,
      library = name.replace(/^(\w)/, m => m.toUpperCase()),
      proxyPort = 8081,
      plugins = [],
      loaders = [];

  if(env.production) {
    name += `-${version}.min`;

    plugins.push (
      new webpack.optimize.uglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false
        }
      })
    );
  }

  if(fs.existsSync('./.babelrc')) {
    let babelConf = JSON.parse(fs.readFileSync('./babelrc'));
    loaders.push({
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: babelConf
    });
  }

  return {
    entry: './lib/app.js',
    output: {
      filename: `${name}.js`,
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/static/js/',
      library: `${library}`,
      libraryTarget: 'umd'
    },
    plugins: plugins,
    module: {
      loaders: loaders
    },
    devServer: {
      proxy: {
        "*": `http://127.0.0.1:${proxyPort}`
      }
    }
  };

}
