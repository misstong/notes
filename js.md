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

