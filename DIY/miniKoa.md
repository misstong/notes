## 1. miniKoa 0.1

1.1、使用http实现最基本的server

在JavaScript中实现server最简单的方式是使用http模块，代码如下
```javascript
const http = require('http')
const server = http.createServer((req,res)=>{
    // do something
    res.end('hello')
})
server.listen(port, callback)
```
http模块createServer接受一个函数，函数接受req,res两个参数

使用http模块创建server的方法比较简单，我们希望对http模块进行封装，从而更方便地使用。我们希望最终的使用方式如下：
1.2：目标使用方式
```javascript
const mKoa = require('MKoa')
const app = new mKoa()
app.use(async ctx=>{

})
app.listen()
```


为了实现上述API，我们首先实现MKoa类，它有两个方法，use方法用来注册回调函数，listen方法用来创建http server,并且监听。
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
上面的实现只能注册一个回调函数，为了注册多个回调函数，改进如下
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
使用数组来存储回调函数（中间件），当有多个中间件时，需要将这些中间件合成一个大的函数，我们需要实现一个函数叫compose，它的目的就是为了合并中间件。

### compose


最简单的想法是依次调用middleware
```javascript
// do something
this.middlewares.forEach(m=>{
    m(req,res)
})
```
按上面思路写个compose函数，实现如下：
```javascript
const compose = (middlewares)=> (req,res)=>{
    middewares.forEach(m=>{
        m(req,res)
    })
}
```
这里我们不用这种顺序执行的方式。

当有多个函数时，fn1,fn2,fn3时，我们希望最终合成fn3(fn2(fn1()))
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
这样有个问题就是不能支持异步函数。

然而这也不是koa中实现的方式，koa实现的中间件模型是洋葱模型
```javascript
//f1
app.use(async (ctx, next) => {
    //do something
   await next()
})
```
Koa封装了requset和response为context，暂时不考虑context的封装，也就是通过MKoa注册的中间件形式如下
```javascript
app.use((req,res,next)=>{
    //do something 
    await next()
})
```
其中next表示的是后面注册的中间件执行效果，所以compose函数需要实现的效果就是将形如
```javascript
app.use((req,res,next)=>{
    //do something 
    await next()
})
```
的中间件们转换为(req,res)=>{}的函数，下面是实现方法

```javascript
const compose =(middlewares) => (req, res) => {
    return dispatch(0)
    function dispatch(i) {
        const fn = middlewares[i]
        if (!fn) {
            return Promise.resolve()
        }
        try{
            return Promise.resolve(fn(req,res,function(){
                return dispatch(i+1)
            }))
        }catch(err){
            return Promise.reject(err)
        }
        
    }
}
```

