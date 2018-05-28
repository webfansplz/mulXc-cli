# 使用 webpack 构建多页面应用

## 前言

之前使用 vue2.x + webpack3.x 撸了一个 vue 单页脚手架

[vue 版 spa 脚手架](https://segmentfault.com/a/1190000012736387)

有兴趣的同学可以看下,内附详细注释,适合刚学习 webpack 的童鞋.

[react 版 spa 脚手架](https://github.com/webfansplz/react-cli)

但在一些场景下,单页应用显然无法满足我们的需求,于是便有了

[mulXc-cli](https://github.com/webfansplz/mulXc-cli)

好了,废话不多说,进入正题!!!!

## 文件结构

```javascript
├── build                       构建服务和webpack配置
  ├──── build.js                  构建全量压缩包 (打包项目)
  ├──── setting.js                多页面入口配置
  ├──── style.js                  页面1对1抽取生成css文件
  ├──── utils.js                  工具类
  ├──── webpack.base.conf.js      webpack通用配置
  ├──── webpack.dev.conf.js       webpack开发环境配置
  ├──── webpack.prod.conf.js      webpack生产环境配置
├── config                      webpack开发/生产环境部分配置
├── dist                        项目打包目录
├── package.json                项目配置文件
├── src                         项目目录
├──── common                    多页面公用方法与css
├──── about                     about页面
├──── home                      home页面
```

## 思路

多页面应用,顾名思义:就是有多个页面(废话!!!)

**从 webpack 的角度来看:**

1.多个入口(entry),每个页面对应一个入口,理解为 js 资源.

2.多个 html 实例,webpack 使用[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)插件来生成 html 页面.

3.每个页面需要对应的 css 文件.webpack 使用[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)抽取 css.

这样我们一个多页面应用该有的东西都具备了,go,开撸!!!

## 入口配置与 html 页面生成

通过以上文件结构,我们可以找到我们在 build/setting.js 进行了多页面入口配置与 html 页面生成。

**setting.js**

```javascript
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
```

**webpack.base.conf.js**

```javascript
//引入setting.js 入口配置方法,与html生成配置
const { entryList, pageList } = require('./setting.js');

const baseConf = {
  entry: entryList(),
  plugins: [...pageList()]
};
```

## css 文件生成

通过以上文件结构,我们可以找到我们在 build/style.js 进行了 css 文件生成。

**style.js**

```javascript
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
  //插件实例
  stylePlugins: plugins
};
```

**webpack.prod.conf.js**

```javascript
//引入方法
const { rulesList, stylePlugins } = require('./style.js');

const prodConf = {
  module: {
    rules: [...rulesList()]
  },
  plugins: [...stylePlugins]
};
```

## 总结

ok,一个简易版的多页面应用脚手架就这样搞定啦,是不是很简单!!!

[gayhub 地址](https://github.com/webfansplz/mulXc-cli)

喜欢的童鞋给个 **star** 哈.您的支持就是我最大的动动动力!!!
