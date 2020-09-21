## React

### 组件
```javascript
//函数式
function A(props) {
    return (

    )
}

// class
class B extends React.Component{
    constructor(props) {

    }
    render(){
        return (

        )
    }
}
```
React是组件化的Ui库，支持两种组件定义方式。

### 状态和生命周期

函数式组件通过useState定义状态，

函数式组件通过useEffect控制组件生命周期的回调函数执行。
```javascript
const [A,setA] = useState()
useEffect(()=>{
    // do something
},[])

```

class组件通过this.state ={}定义状态,可以在各个生命周期函数中增加处理逻辑
```javascript

class A extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    componentWillMount(){

    }
    componentDidMount(){

    }

}
```

### 组件重新渲染

A,B,C三个组件，A父组件，B，C子组件，B改变了A的状态，会导致B和C都重新渲染，即使C的props没变.

props发生变化，并不会导致渲染；目前所知setState是触发重新渲染的方法；

connect是高阶组件，会封装传入的组件，并且会在store里监听包装组件的update方法，所以子组件dispatch会自动重新渲染

### props as state
https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e

场景：
初始化表单时，先通过传入数据显示，然后可以通过操作更改数据，这些数据保存在state中，state是由props初始化，最后提交的是state。

陷阱：
在构造器中，初始化state为props，只会在组件刚创建时执行，因此如果props发生变化，state不能更新。 因此一般是anti-pattern的

However, it’s not an anti-pattern if you make it clear that the prop is only seed data for the component’s internally-controlled state:

总结：需要把props作为state的初始状态这种情况下，可以在生命周期函数里赋值

### 样式使用
在React中使用样式
1、直接import样式文件
import './index.css'

2、import from
import styles from './index.css'
```javascript
//使用
<a className={styles.xx}>
```

## Router

### 基本使用

```javascript
<BrowserRouter>
    <Switch>
        <Route path="/about"><About/> <Route/>
        <Route path="/users"><User/><Route/>
    </Switch>

</BrowserRouter>
```
最外层使用BrowserRouter包裹，BrowserRouter是react-router-dom里web端对应的根路由。
Switch组件遍历它的children，渲染第一个匹配url的Route。
Route组件根据给定的path匹配url，匹配则渲染children，并且将location，history等传入children

### 其它常用组件

Link: 默认渲染a元素，to属性指定跳转路由
```javascript
<Link to='/about'>About</Link>
```

NavLink：在Link组件上增加了样式，当条目匹配url时，增加的样式生效
```javascript
<NavLink to="/faq" activeClassName="selected">
  FAQs
</NavLink>
```
当url==='/faq'，样式selected生效

### 嵌套路由

```javascript
//最外层
<BrowserRouter>
    <Switch>
        <Route path="/about"><About/> <Route/>
        <Route path="/users"><User/><Route/>
    </Switch>

</BrowserRouter>

function Users(props) {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}/:userId`}><User/></Route>
            <Route path={match.path}>default</Route>
        </Switch>
    )
}
```
外层路由根据url渲染，当url=='/about'渲染About组件，url=='/users'渲染Users组件。User组件内部又包含一层路由，默认显示default，当url为'/user/:userId'时,渲染User组件

### Route组件

当url匹配当前path时，渲染当前组件。官方推荐使用children element，就是下面这样渲染组件
```javascript
<Route path="/news">
        <NewsFeed />
</Route>
```

为了兼容，还有下面三种render方法：

```javascript
<Route component>
<Route render>
<Route children>
```
三种方式都会将match,location,history传入组件。

### Hooks

通常最外层包裹了BrowserRouter，Route组件会将三个属性match,history,location传递给路由组件。通过hooks，可以在任意组件内部获取到history等实例。

useHistory可以获取到history
```javascript
function CC(){
    let history = useHistory()

    history.push('/home')
}
```

useLocation可以获取到location对象
```javascript
let location = useLocation()
```

useParams可以获取到key/val形式的url参数
```javascript
let {} = useParams()
```

useRouteMatch可以获取到match对象
```javascript
let match = useRouteMatch('/blog/:slug')
```


## Redux

### 基本使用

1.store 

通过createStore函数生成store对象，createStore函数接受一个函数
```javascript
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

let store = createStore(counter)
```

2、dispatch/subscribe
```javascript
store.dipatch({ type: 'INCREMENT' })
store.subscribe(() => console.log(store.getState()))
```
生成的store有dispatch和subscibe方法,dispatch触发更改，subscribe注册callback，当状态发生变化调用callback


## React-Redux

### 基本使用

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```
最外层使用provider包裹整个应用，传入store

其他组件可以直接导入store进行使用，但是必须手动订阅更新，使用connect高阶组件可以将store注入组件，并且自动订阅组件render函数
```javascript
const mapStateToProps = (state, ownProps) => ({
  // ... computed data from state and optionally ownProps
})

const mapDispatchToProps = {
  // ... normally is an object full of action creators
}

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
  mapStateToProps,
  mapDispatchToProps
)
// and that function returns the connected, wrapper component:
const ConnectedComponent = connectToStore(Component)

// We normally do both in one step, like this:
connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)

```
如果connect不传第二个参数，组件默认会得到dispatch方法

mapDispatchToProps例子
```javascript
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
```

### Hooks

最外层还是Provider包裹

1、useSelector

获取store的某些状态
```javascript
 const counter = useSelector(state => state.counter)
```
useSelector接受的函数近似于mapStateToProps;
当dispatch action后，useSelector会引用比较，如果不同，组件会重新渲染

2、useDispatch

获取dispatch函数
```javascript
import React from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </button>
    </div>
  )
}
```

该吃药了
