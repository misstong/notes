## computed和watch

### 基本使用
computed例子
```javascript
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>

var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

watch例子
```javascript
<div id="demo">{{ fullName }}</div>

var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

区别：computed根据已有的属性生成一个新的属性存在data中，属性名就是computed对应的key
watch的key是监听的属性，当监听的属性发生变化做一些响应（可以是改变某个属性，可以获取数据等）

监听的对象位置是不同的，计算属性监听的属性在函数体内使用到的属性，而侦听器是对应的key

## 原理

先看下计算属性，初始化计算属性是在函数initComputed中，
因为计算属性不仅可以是函数，也可以是拥有getter/setter对象，暂时不考虑对象这种情况
```javascript
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ..
```
对应一个计算属性，首先获取到定义的函数（如果是object情况，获取getter函数），然后生成计算watcher
```javascript
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)
```

初始化侦听器是initWatch
侦听器对应的handler也可以是一个函数数组，如果是数组，遍历数组，对每一个handler做一次监听。因此看下侦听器是函数这种情况就能明白数组这种情况如何处理。

一个handler可以是对象，这种情况处理函数是它的handler属性，
可以是字符串，这种情况处理函数通过vm[str]获取到实例上的方法

对于函数的侦听是通过如下代码实现
```javascript
vm.$watch(keyOrFn, handler, options)

Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
    ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
        watcher.teardown()
    }
}
```
侦听器初始化首先调用createWatcher函数，内部是通过$watch方法进行监听，而$watch内部也是通过Watcher进行监听，这种watcher叫用户watcher，用户watcher立即执行get获取到侦听key对应的属性的value，也可以自己传入参数控制watcher行为。

从上面分析可以看出，用户watcher除了可以在生成vue实例时指定watch属性，也可以直接调用$watch方法生成，两者效果一样。

所有计算属性和侦听器都是通过watcher进行监听，差别在于传入watcher的第二和第三个参数。计算属性第二个exprOrFun参数传入的是函数，而侦听器传入的字符串，侦听器的handler是第三个参数传给watcher。所以要完全理解计算属性和侦听器的区别，必须搞明白Watcher第二个参数不同情况的区别。

同时注意计算属性传入的第四个参数指明了lazy模式
```javascript
   // 计算属性
   watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)
//侦听器
 const watcher = new Watcher(vm, expOrFn, cb, options)
 ```


### watcher源码解析

```javascript
 // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
```
watcher中处理第二个参数的代码如上，对于字符串的情况，生成一个访问属性的函数赋值为getter，如果是函数，则直接赋值给getter，所以getter是watcher用来访问被监听属性的函数。而vue中data是响应式的，当调用getter访问属性时，当前watcher就会被记录为依赖，当属性变化时，就会watcher调用getter更新watcher中记录的value值


计算属性生成watcher时传入的第二个参数是函数，第四个参数指定了lazy为true，因为watcher初始化时，不会计算出计算属性的值。当组件进行render生成vnode时，会使用到计算属性，这时才会调用watcher的get方法。那render时是怎么调用到watcher的get方法的呢？ 是在生成watcher后会调用defineComputed，从而在vm实例上绑定了一个computed对应的属性。因此在render时访问计算属性就会调用createComputedGetter(key)。作用是从vm实例中取出对应watcher，然后计算该watcher返回计算完的value
```javascript
function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
        // 调用get、还原Dep.target
      }
      // 计算属性对应的watcher被弹出后，有可能Dep.target被还原为渲染watcher，下面的代码将渲染watcher加到了当前watcher所有的dep需要通知的watcher中去
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}
```

mountComponent时也会生成渲染watcher，代码如下。因为不是lazy，生成watcher时就会调用传入的updateComponent函数，在调用render函数生成vnode时，访问到的所有属性都会将渲染watcher加入到依赖中
```javascript
  vm._watcher = new Watcher(vm, updateComponent, noop);
```

当调用watcher的get方法时，会将当前watcher设置为全局变量(Dep.target)，原有的Dep.target暂存到全局变量
 ## watcher和vm实例

vm实例中响应式data和watcher通过dep关联，每一个属性对应一个dep，其中记录了该属性对应的所有watcher。

一个vm实例有一个渲染watcher，多个计算watcher



- watch和computed基本用法
- watch和$watch等同
- 计算watcher和用户watcher差别在于传入watcher的参数

|---| 计算watcher | 用户watcher |
| ---- | ---- | ---- |
| expOrFun参数 | 函数/对象 | 字符串 |
| option参数| lazy=true| user=true|

- vm响应式数据通过dep和watcher关联起来
- 计算属性的调用时机是使用时，会找到对应的watcher调用get方法。在模板渲染会在调用render函数生成vnode时调用计算属性的get
- 用户watcher初始化时会立即调用计算出对应的value存在watcher中，当属性变化时，通过dep调用watcher的run方法，判断值变化与否，调用callback