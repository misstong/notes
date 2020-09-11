## vue中的缩写

v-bind缩写为:
v-on缩写为@

## 路由

配置路由：类似vueRouter，显示的

约定路由：根据目录结构，隐式的

代码写的：react router

## 全屏切换

点击=》路由切换=》路由守卫取到参数决定是否全屏=》根据参数显示外边框与否

## trello笔记

后端：

创建根目录，package.json

建立目录结构
    src
        -configs
        -controllers
        -models
        -middlewares
        -attachments
        -validators
        -database
        app.ts

入口文件app.ts
    基本结构 koa、koa-router

提前配置文件到configs目录

增加controllers，使用koa-ts-controllers，导入controllers中的路由

通过sequelize迁移管理数据库

模型类以及controller中业务处理逻辑



