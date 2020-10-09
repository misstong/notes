## vuerouter

使用vue.use注册插件，接收的参数可以是对象，对象必须包含install方法

当定义vue router为类时，类具有静态方法install

install: 主要混入一个方法，使创建vue时增加$router属性

createRouteMap:创建path-component键值对

initEvent：注册popstate事件

initComponents：注册了两个全局组件，router-view的render函数使用了this.data.current这个响应式数据，所以点击跳转时current发生改变，自动执行render函数，view刷新

用到的全局方法：
vue.mixin
vue.component
vue.observable

生命周期函数
beforecreate


## vue

1、vue的钩造函数，将传入属性挂载到实例上，属性代理，将属性代理到data属性中
三个属性： data， options， el
代理：在实例上定义访问器，访问到实例的data上的数据

2、将数据转成响应式数据

