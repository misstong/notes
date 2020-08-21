https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e

场景：
初始化表单时，先通过传入数据显示，然后可以通过操作更改数据，这些数据保存在state中，state是由props初始化，最后提交的是state。

陷阱：
在构造器中，初始化state为props，只会在组件刚创建时执行，因此如果props发生变化，state不能更新。 因此一般是anti-pattern的

However, it’s not an anti-pattern if you make it clear that the prop is only seed data for the component’s internally-controlled state:

总结：需要把props作为state的初始状态这种情况下，可以在生命周期函数里赋值