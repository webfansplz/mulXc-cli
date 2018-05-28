const path = require('path');
//抽取css文件插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//引入入口配置
const { entryList, entryFiles } = require('./setting.js');
//多个ExtractTextPlugin实例
const plugins = [];
entryFiles.map(v => {
  plugins.push(
    new ExtractTextPlugin({
      filename: `css/${v}.[contenthash].css`,
      allChunks: false
    })
  );
});

module.exports = {
  //使用正则匹配到每个页面对应style文件夹下的css/less文件,并配置loader来进行解析.从而实现html<->css 1对1
  rulesList: () => {
    const rules = [];
    entryFiles.map((v, k) => {
      rules.push({
        test: new RegExp(`src(\\\\|\/)${v}(\\\\|\/)style(\\\\|\/).*\.(css|less)$`),
        use: plugins[k].extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      });
    });
    return rules;
  },
  stylePlugins: plugins
};
