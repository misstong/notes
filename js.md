## process.cwd(), _dirname, _filename, ./, ../

前三个绝对路径，后两个相对路径，第一个当前工作目录，第二个当前脚本目录

## Object.getPrototypeOf()

可以获取到对象的构造函数的prototype，也就是__proto__的属性；在类里，就可以获取到类定义的属性、方法

## promise
promise接受一个函数，在初始化时同步执行。
resolve, reject是异步的，微任务
定时器是宏任务
同步 》 微任务 》 宏任务

## 获取表单的值

1. 通过双向绑定将输入的值传到状态中

2. 获取元素引用，直接获得值


## 移动端touch事件

### 
touchStart/touchMove/touchEnd
类似于mouseDown/mouseMove/mouseUp

touch事件中有三个属性

touches: 当前屏幕上手指数

targetTouches: 当前元素的手指数

changedTouches： 触发当前手指列表

### 事件点透

混用touch和click事件，而touch事件有个事件差

点击穿透问题：点击蒙层（mask）上的关闭按钮，蒙层消失后发现触发了按钮下面元素的click事件

跨页面点击穿透问题：如果按钮下面恰好是一个有href属性的a标签，那么页面就会发生跳转

另一种跨页面点击穿透问题：这次没有mask了，直接点击页内按钮跳转至新页，然后发现新页面中对应位置元素的click事件被触发了

## 拖拽

mouse事件模拟drag，同时加上阈值，超过阈值开始drag

1， 注册mouse事件，mousedown,mousemove,mouseup
2, mousedown事件记录鼠标和元素位置，标记mousedown,防止mousemove在mouse没down时触发
3， mousemove首先判断鼠标down没，down了，再判断当前位置与元素鼠标位置是否超过阈值，没超过什么都不做，超过了分为start和move两阶段，通过isDrag标记识别，isDrag为否说明刚开始触发dragstart事件，否则触发dragmove事件
整个过程：
mousedown-----阈值范围-----start--drag