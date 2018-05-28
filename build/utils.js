const path = require('path');
const prodConfig = require('../config').build;
module.exports = {
  _resolve: _path => path.resolve(__dirname, _path),
  assetsPath: _path => path.posix.join(prodConfig.assetsPath, _path)
};
