## 组件重新渲染

A,B,C三个组件，A父组件，B，C子组件，B改变了A的状态，会导致B和C都重新渲染，即使C的
props没变

props发生变化，并不会导致渲染；目前所知setState是触发重新渲染的方法；

connect是高阶组件，会封装传入的组件，并且会在store里监听包装组件的update方法，所以子组件dispatch会自动重新渲染

## props as state
https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e

场景：
初始化表单时，先通过传入数据显示，然后可以通过操作更改数据，这些数据保存在state中，state是由props初始化，最后提交的是state。

陷阱：
在构造器中，初始化state为props，只会在组件刚创建时执行，因此如果props发生变化，state不能更新。 因此一般是anti-pattern的

However, it’s not an anti-pattern if you make it clear that the prop is only seed data for the component’s internally-controlled state:

总结：需要把props作为state的初始状态这种情况下，可以在生命周期函数里赋值