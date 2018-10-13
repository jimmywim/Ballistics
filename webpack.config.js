const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  mode: 'development',
  devServer: { historyApiFallback: true, },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  }
};
