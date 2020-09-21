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
