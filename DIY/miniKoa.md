## 1.使用http实现最基本的server
```javascript
const http = require('http')
const server = http.createServer((req,res)=>{
    // do something
    res.end('hello')
})
server.listen(port, callback)
```
http模块createServer接受一个函数，函数接受两个参数

目标使用方式
```javascript
const mKoa = require('MKoa')
const app = new mKoa()
app.use(async ctx=>{

})
app.listen()
```

## 2.1 miniKoa

```javascript
class MKoa{
    // constructor() {
    //     this.middlewares = []
    // }
    use(fn){
        this.callback = fn
    }
    listen(...args) {
        const server = http.createServer((req,res)=>{
            this.callback(req,res)
        })

        server.listen(...args)
    }
}
```