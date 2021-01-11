## hooks API

- useState
- useEffect
比较简单

- useReducer 
类似redux， 传入reducer函数，另一种管理状态的hook

- useMemo 
用法和useEffect一样，类似vue的计算属性，缓存计算

- useCallback
缓存函数引用

- useRef
获取dom元素
跨生命周期存储变量，例如存入定时器

- Memo 
类似类组件的pureComponent

## React-redux

简化状态传递
自动订阅更新

- connect 
```javascript
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```

将属性注入ui组件， 与provider配合

- provider

```javascript
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```



## redux

- createStore

```javascript
// {...state,{pageForm:{[key]: value}}}

update(this.state, {
    pageForm: {
        [key]: {
            $set: value
        }
    }
})
```


## dva
dva = React-Router + Redux + Redux-saga

封装redux、redux-saga的数据流解决方案，内置react-router、fetch

## umi

配置式路由

