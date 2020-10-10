## post请求提交方式
参考：https://blog.csdn.net/bigtree_3721/article/details/82809459

### application/x-www-form-urlencoded
```
POST http://www.example.com HTTP/1.1

Content-Type: application/x-www-form-urlencoded;charset=utf-8

 

title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
```
数据像url那样进行编码

### multipart/form-data

上传表单文件时，必须让 <form> 表单的 enctype 等于 multipart/form-data

表单
```
<form action="/upload" enctype="multipart/form-data" method="post">

    Username: <input type="text" name="username">

    Password: <input type="password" name="password">

    File: <input type="file" name="file">

    <input type="submit">

</form>
```

```
POST http://www.example.com HTTP/1.1

Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA

 

------WebKitFormBoundaryrGKCBY7qhFd3TrwA

Content-Disposition: form-data; name="text"

 

title

------WebKitFormBoundaryrGKCBY7qhFd3TrwA

Content-Disposition: form-data; name="file"; filename="chrome.png"

Content-Type: image/png

 

PNG ... content of chrome.png ...

------WebKitFormBoundaryrGKCBY7qhFd3TrwA--
```
浏览器生成一个boundary，消息主体分为几个结构，以boundary分割

### application/json

```
POST http://www.example.com HTTP/1.1

Content-Type: application/json;charset=utf-8

 

{"title":"test","sub":[1,2,3]}
```