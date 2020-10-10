# 1
## 工作模式

production, development, none

## 工作原理

webpack支持多种模块化方式，commonjs,esm.

生成的bundle文件中包含bootstrap部分，主要是require函数；剩余部分是各个被函数包裹的模块

## 资源文件处理

webpack默认将文件当作js处理，css-loader将css文件转化成js module，style-loader将样式以style标签加到页面中

## 文件处理

file-loader将文件拷贝到dist，返回文件路径

url-loader将文件变成data-url形式存在bundle.js中，不需要拷贝文件

可以将小文件用url-loader处理，大文件用file-loader

```javascript
{
    test: /.png$/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 10*1024 //10kb
        }
    }
}

```
需要同时安装file-loader，因为url-loader超出limit会调用file-loader，不需要显示配置file-loader

## 加载资源

webpack支持requirejs, commonjs, esm

处理css文件时，对url函数，@import指令对触发资源加载
html-loader处理html时，会对image的src触发加载，可以设置html-loader
```javascript
   {
        test: /.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'a:href']
          }
        }
      }
```

### loader

loader对外暴露一个函数，参数为处理的内容，输出为处理后的内容,javascript代码,返回的内容会直接放在bundle.js模块函数中
```javascript
module.exports = source=>{
    // ...
    return 
}
```

## 常用插件

CleanWebpackPlugin清理dist目录

html-webpack-plugin自动生成html文件，加入生成的bundle链接,可以增加options
```javascript
plugins:[
    new HtmlWebpackPlugin({
        title: 'xxx',
        template:'./xxx.html'
    })
]
```

CopyWebpackPlugin 拷贝静态资源,开发阶段不要配置，在dev-server中配置目录
```javascript
plugins: [
    new CopyWebpackPlugin([
        'public'
    ])
]
```

## 插件机制

插件必须是一个函数或包含apply方法的对象，apply方法参数是compile对象，包含了编译的信息
在生命周期的钩子函数注册函数实现


# 2

## 自动编译
webpack以watch模式启动

## 自动刷新浏览器

browser-sync dist --files '**/*'

## webpack-dev-server

集成自动编译，自动刷新浏览器，

安装运行即可，npm i webpack-dev-server;

如果有静态资源需要配置，可以增加devServer属性
```javascript

module.exports = {
    entry: '...',
    devServer: {
        contenBase: 'public'
    }
}
```

还可以设置代理
```javascript
module.exports = {
    entry: '...',
    devServer: {
        proxy:{
            '/api': {//请求前缀 
                target: 'http://tang.com' //http://tang.com/api/user
                pathRewrite: {
                    '/api': '' //http://tang.com/user
                }
            },
            changeOrigin: true //http中host会变成target的IP
        }
    }
}
```
## HMR

集成在devsever中，需要设置两个地方设置1.devServer的hot属性为true，2.new webpack.HotModuleReplacementPlugin()
```javascript
module.exports = {
    devServer: {
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
HMR不是开箱即用，css可以，其他需要手动处理

给module提供了hot属性，使用api处理，就不会自动刷新
```javascript
if (module.hot) {
    module.hot.accept('./editor', () => {
    }}
```
意思是当editor模块变化时，执行下面代码

## source map

配置devtool选项
```javascript
module.exports = {
    devtool: 'eval'
}
```
eval不生成sourcemap文件

开发 cheap-module-eval-source-map

生产 none

# 3 
## 生成环境优化

1. mode配置
2. 不同配置（中小型项目）

webpack支持导出一个函数，函数接收两个参数env,argv，返回配置对象
```javascript
module.exports = (env, argv) => {
    const config={...}
    if (env==='production'){
        //....
    }
    return config
```
运行命令webpack --env production就会传入production

3. 不同配置文件

新建webpack.common.js, webpack.dev.js, webpack.prod.js

```javascript
const common = require('./webpack.common')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin('public')
    ]
})
```
merge模块会自动合并默认配置和额外配置
运行命令 yarn webpack --config webpack.prod.js

## DefinePlugin

production mode下这个模块会自动注入环境变量
process.env.NODE_ENV = 'production'

可以通过模块注入一些会变更的值，比如API的url

## treeshaking

去掉未引用代码，production默认开启

手动开启
```javascript
module.exports = {
    mode: 'none',
    entry: './src/index.js',
    outpu: {
        filename: 'bundle.js'
    },
    optimization: {
        usedExports: true,//标记未引用模块
        concatenateModules: true, // 合并模块,打包后的模块只导出一个函数
        minimize: true // 去掉未引用代码
    }
}
```
treeshaking && babel

1. treeshaking的代码必须是ESM的代码
2. ESM代码通过babel-loader(@babel/preset-env)转换成commonJs

babel-loader会根据环境判断是否转换成commonjs,所以treeshaking接收的代码还是ESM，因此treeshaking能正常工作
```javascript
module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename:'bundle.js'
    },
    modules: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {modules: false}]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        usedExports: true
    }
    
}
```

## sideeffects


## 多入口打包,提取公共模块

可以用于将打包文件分块
```javascript
module.exports = {
    entry: {
        index: '',
        main:''
    }
}
```

配置optimization参数提取公共模块
```javascript
module.exports={
optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  },
}
  
```

## 动态导入/魔法注释

ES支持import函数动态导入模块，返回一个promise.
webpack会将动态导入模块单独打包，可以通过注释指定打包文件名
```javascript
const home = ()=>import(/* webpackChunkName: 'components' */'home')
```

## 输出文件名hash
```javascript
module.exports={
    entry:'./...',
    output:{
        filename: '[name].[*:8].bundle.js'
    }
}
```
*选项有:
1. hash 项目级别，项目任何文件改变文件名就改变
2. chunkhash 文件发生改变，依赖树上方模块对应文件名改变
3. contenthash 文件内容

可以通过:number指定hash长度