# React服务端渲染-SSR

## 一. 服务端渲染基础

### 1.1 什么是服务端渲染

> 简单来说，就是通过服务器端生成HTML，组装好页面数据，返回给浏览器。
>
> 浏览器拿到服务端返回的html文件，直接渲染出页面

我们来看如下一个服务端渲染案例

~~~js
//app.js
const express = require('express')

const app = express()

app.get('/',(req,res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>Hello React Service Render</h1>
    </body>
    </html>
    `)
})

app.listen(3000,function(){
    console.log('Server running...')
})
~~~

在命令行运行 `node app.js`,在浏览器通过 `localhost:3000` 访问。然后我们通过调试工具看一下源代码

![image-20200915211735783](/Users/maxiaofei/Desktop/Web/React/React-Service-Render/React服务端渲染.assets/image-20200915211735783.png)

可以看到，页面展示的内容在源代码中完全的呈现出来，这说明服务器返回给浏览器的就是完整的Html文件，浏览器只需要将其渲染出来即可

### 1.2 什么是客户端渲染

> 前面说到，服务端渲染是由服务端组装HTML，那么客户端渲染，也就是在客户端组装HTML内容

通过 `create-react-app` 创建的React项目就是客户端渲染，来看一下跟上面的服务端渲染有什么不一样

![image-20200915214202109](/Users/maxiaofei/Desktop/Web/React/React-Service-Render/React服务端渲染.assets/image-20200915214202109.png)

查看源代码的时候，可以发现，`body` 标签中只有一个id为root的div，然后通过 `bundle.js` 文件来组装DOM，然后插入到root中

像这种通过客户端加载j s文件，完成页面组装和加载的，就是客户端渲染

### 1.3 客户端渲染和服务端渲染优缺点

**客户端渲染优缺点**

- 前后端分离，开发效率比较高

- 首屏时间比服务端渲染慢，不利于SEO
- 大多数爬虫只能识别html中的文本内容，不能识别j s文本中的内容
- 客户端渲染是通过bundle.js文件来渲染页面内容
- 客户端渲染举例：通过 create-react-app 创建的项目就是客户端渲染

**服务端渲染**

- 更好的SEO，更快的首屏渲染
- 代码量比客户端渲染大，开发效率更低一点
- 增加了服务端的压力

### 1.4 客户端渲染和服务端渲染的本质区别

![Snipaste_2020-09-15_13-59-57](/Users/maxiaofei/Desktop/Web/React/React-Service-Render/React服务端渲染.assets/Snipaste_2020-09-15_13-59-57-0178144.png)

**本质区别：**本质区别是由谁来完成HTML完整拼接，服务端渲染是在服务器生成DOM树，客户端渲染是在客户端生成DOM树

**响应速度：**服务端渲染的速度快于客户端渲染

**SEO：**服务端渲染更利于SEO，大部分爬虫只能爬去HTMＬ文件中的内容，服务端渲染就是直接把完整的ＨＭＴＬ返回给浏览器进行渲染的，而客户端渲染是通过ｊｓ进行加载的，爬虫无法识别ｊｓ文件中的内容

**开发效率**：客户端渲染的开发效率要高于服务端渲染。客户端渲染开发是前后端分离，效率更高。服务端渲染增加了前后端的耦合性，开发难度提高，效率降低

**直观的区分客户端渲染和服务端渲染：**网页源码里面可以直接看到网页内容的是服务端渲染，否则，就是客户端渲染，通过bundle.js文件来进行页面渲染

