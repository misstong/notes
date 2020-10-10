## 1. miniKoa 0.1

A、使用http实现最基本的server
```javascript
const http = require('http')
const server = http.createServer((req,res)=>{
    // do something
    res.end('hello')
})
server.listen(port, callback)
```
http模块createServer接受一个函数，函数接受两个参数

B：目标使用方式
```javascript
const mKoa = require('MKoa')
const app = new mKoa()
app.use(async ctx=>{

})
app.listen()
```

### 0.1 miniKoa

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

## 0.2 miniKoa


支持多个中间件

```javascript
class MKoa{
    constructor() {
        this.middlewares = []
    }
    use(fn){
        this.middlewares.push(fn)
    }
    listen(...args) {
        const server = http.createServer((req,res)=>{
            // do something
        })

        server.listen(...args)
    }
}
```

最简单的想法是依次调用middleware
```javascript
// do something
this.middlewares.forEach(m=>{
    m(req,res)
})
```
按上面思路写个compose函数
实现如下：
```javascript
const compose = (middlewares)=> (req,res)=>{
    middewares.forEach(m=>{
        m(req,res)
    })
}
```

先写一个compose函数，作用是将多个函数合并成一个
```javascript
function fn1() {
  console.log('fn1')
  console.log('fn1 end')
}

function fn2() {
  console.log('fn2')
  console.log('fn2 end')
}

function fn3() {
  console.log('fn3')
  console.log('fn3 end')
}

// compose_test.js
// ...
fn3(fn2(fn1()))
```

上面的实现稍作修改，我们希望将前面中间件的结果传入后面的中间件
```javascript
const compose = (middlewares)=> (req,res)=>{
    const [first,...others] = middlewares
    let ret = first(req,res)
    others.forEach(m=>{
        ret=m(req,res,ret)
    })
}
```
这样有个问题就是不能支持异步函数