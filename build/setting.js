//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home]
const entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
//生成html文件插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//工具类提取_resolve方法
const { _resolve } = require('./utils');
//入口文件过滤common文件夹(因为common文件夹我们用来存放多页面之间公用的方法与css,所以不放入入口进行构建!)
const rFiles = entryFiles.filter(v => v != 'common');
module.exports = {
  //构建webpack入口
  entryList: () => {
    const entryList = {};
    rFiles.map(v => {
      entryList[v] = _resolve(`../src/${v}/index.js`);
    });
    return entryList;
  },
  //src文件夹下的文件夹名称 ->[about,common,home]
  entryFiles: entryFiles,
  //使用html-webpack-plugin生成多个html页面.=>[home.html,about.html]
  pageList: () => {
    const pageList = [];
    rFiles.map(v => {
      pageList.push(
        new HtmlWebpackPlugin({
          template: _resolve(`../src/${v}/index.html`),
          filename: _resolve(`../dist/${v}.html`),
          chunks: ['common', v],
          //压缩配置
          minify: {
            //删除Html注释
            removeComments: true,
            //去除空格
            collapseWhitespace: true,
            //去除属性引号
            removeAttributeQuotes: true
          },
          chunksSortMode: 'dependency'
        })
      );
    });
    return pageList;
  }
};
