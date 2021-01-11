options传参 =》 Vue._init(instance/init.js) -> 标记 vm._isVue=true -> 合并构造函数参数和传入参数 -> 初始化vm._renderProxy -> vm._self=vm 

=》 initLifecycle(lifecycle.js)初始化参数 _watcher _isMounted 和父子组件相关
=》 initEvents 和父子组件相关 初始化 vm._events
=》 initRender _vnode $attrs/$listeners
=>  callHook(beforeCreate)
=>  initInjections $options中inject属性，如果存在，会从本实例vm一直向$parent里的_provided属性里查找inject里每个key是否存在
=>  initState  初始化_watchers=[],
                处理props，methods,data,computed, watch属性
                    props: 将props中每个key变成响应式
                    methods:检查方法是否props的key，是否是保留字，将方法绑定到vm上
                    data: 检查是否在props，methods中出现，是否是保留字， observe转成响应式数据，data对象上会记录__ob__
                    computed: 初始化vm._computedWatchers为空对象，对每一个computed属性生成一个计算Wathcer对象放在_computedWatchers中
                    watch: 对watch属性里每个key调用vm.$watch
=>  initProvide将provide设置到vm._provided上
=>  callHook（created）
=>  $mount 如果$options中有el,调用$mount(instance/init.js),
            编译template成render函数(entry-runtime-with-compiler)，(platform/web/runtime/index.js)
            调用mountComponent(instance/lifecycle.js),定义了updateComponent和一个Watcher，将vnode节点挂在到dom上

1. $parent, $children如何建立起关系

2. watcher的异同

```javascript
//计算 watcher
 watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )

// 渲染watcher
new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  //初始化渲染watcher时会将vm._watcher设置为当前watcher，同时加入vm._wathcers
  //updateComponent作为expOrfn传入，会被设为watcher的getter，watcher不是lazy的，创建时会执行一遍getter
  //updateComponent先调用vm._render生成vnode，_render内部主要时调用$options里的render生成vnode
   //                   再调用vm._update,该函数里调用vm.__patch__将新生成的vnode和旧的vnode进行比较挂载到dom上
   //                                       初次挂载时，会生成vnode的dom，将根vnode的dom插入parentDom上，删除oldDom
```

从render函数生成vnode，再由vnode生成dom；
如果存在子组件，那么从vnode生成dom这步在处理这个子vnode到dom的过程，就变成由vnode生成vue实例，然后mount这个vue实例，而mount这个子vue实例就是从它的render函数生成vnode，再由vnode生成dom


3. 如何访问computed
先initComputed时生成计算Watcher，在模板中使用computed，当在render函数调用时，会通过watcher去调用computed，这样computed里面使用到的响应式属性都会将计算watcher加到dep中

4. 计算属性变化后怎么导致视图变化

5. 子组件
子组件在父组件渲染时会生成一个对应的vnode（1），而在父组件挂载时对这个vnode的处理时：先根据模板生成render函数，生成vnode（2），挂载dom，而根据这个模板生成的vnode（2）是vnode（1）的子vnode。
在patch这个vnode（2）时，它对于的dom是没有的，

6. 组件化
支持组件化关键在compiler编译生成render函数时，能够区分自定义组件
核心在生成vnode的createElement函数能够生成组件的vnode（create-component.js190);
而在挂载父组件时对子组件对应的vnode处理时，会先mount子组件。
处理子组件时patch函数会在子组件根vnode上放$el，而子组件内部dom树是连接的，子组件和父组件dom树的链接在createComponent223（patch.js)

