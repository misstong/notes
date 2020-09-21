## rollup

只能处理esm，要处理commonjs要使用rollup-plugin-commonjs插件
只能支持相对路径导入模块，要导入node_modules需要使用rollup-plugin-node-resolve
使用rollup-plugin-json可以只导入json中的一部分（treeshaking)

## 代码拆分

使用动态导入，使用amd format

## 多入口打包
```javascript
export default {
    input: {
        a: '',
        b: '',
    },
    output: {
        dir: 'dist',
        format: 'amd'
    }
}
```
会自动提取公共模块，为了在浏览器中使用必须使用库导入打包模块
```javascript
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>

```
使用requirejs导入模块


## Eslint

在项目中安装eslint依赖;

npx eslint --init 生成配置文件

npx eslint file 如果vscode安装了eslint插件，会自动提醒错误，不需要手动执行

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
      'no-alert': 'error' //代码中使用alert报错
  },
  globals:{
      'JQuery': true //代码中可以使用jquery
  }
}
```

## eslint配置注释

作用是告诉eslint忽略某种错误

```javascript
const str1 = "${name} is a coder" // eslint-disable-line 
```

## 结合自动化工具

gulp-eslint

在babel转换代码之前加上gulp-eslint
```javascript
const script = () => {
    return src('src/assets/scripts/*.js', {base: 'src'}).
        pipe(plugins.eslint())
        .pipe(plugins.eslint.format()) //输出结果
        .pipe(plugins.eslint.failAfterError()) //错误停止
        .pipe(plugins.babel({presets:['@babel/preset-env']}))
        .pipe(dest('temp'))
}
```

eslint-loader

增加一个rules处理js文件
```javascript
{
    test: /.js$/,
    use: 'eslint-loader',
    enforce: 'pre'  //首先执行
}
```

在react项目中，需要配合eslint-plugin-react使用


## stylelint

检查css格式

stylelint-config-sass-guidelines sass校验

## git hooks

.git目录下hooks目录存放了很多sample文件

husky实现前端与git钩子的结合,在package.json中新增字段
```javascript
husky:{
    hooks: {
        'pre-commit': 'npm run test'
    }
}
```

lint-staged可以配合husky实现commit前后更多处理



