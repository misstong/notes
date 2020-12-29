### @SpringBootApplication注解
结合了三个注解

- @SpringBootConfiguration表明这是个配置类，可以在类中添加基于java的配置，是@Configuration注解的特殊形式
- @EnableAutoConfiguration启动自动配置，springboot自动配置它认为需要的组件
- @ComponentScan启动组件扫描。spring可以自动发现并注册带Component，Controller、Service等注解的类

### @RunWith

### @SpringBootTest
加载spring上下文用于测试

### @Controller
标识类是组件，以便扫描组件。作用等同于Service、Component、Repository

### 模板
controller返回值是视图的逻辑名称，模板路径='/tempaltes/'+ logic name +'.html'
所以模板放在'src/main/resource/templates/xx.html'