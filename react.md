## 组件重新渲染

A,B,C三个组件，A父组件，B，C子组件，B改变了A的状态，会导致B和C都重新渲染，即使C的
props没变

props发生变化，并不会导致渲染；目前所知setState是触发重新渲染的方法；

connect是高阶组件，会封装传入的组件，并且会在store里监听包装组件的update方法，所以子组件dispatch会自动重新渲染