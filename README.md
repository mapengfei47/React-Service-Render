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

![image-20200915211735783](./React服务端渲染.assets/image-20200915211735783.png)

可以看到，页面展示的内容在源代码中完全的呈现出来，这说明服务器返回给浏览器的就是完整的Html文件，浏览器只需要将其渲染出来即可

### 1.2 什么是客户端渲染

> 前面说到，服务端渲染是由服务端组装HTML，那么客户端渲染，也就是在客户端组装HTML内容

通过 `create-react-app` 创建的React项目就是客户端渲染，来看一下跟上面的服务端渲染有什么不一样

![image-20200915214202109](./React服务端渲染.assets/image-20200915214202109.png)

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

![image-20200915214202109](./React服务端渲染.assets/Snipaste_2020-09-15_13-59-57.png)

**本质区别：**本质区别是由谁来完成HTML完整拼接，服务端渲染是在服务器生成DOM树，客户端渲染是在客户端生成DOM树

**响应速度：**服务端渲染的速度快于客户端渲染

**SEO：**服务端渲染更利于SEO，大部分爬虫只能爬去HTMＬ文件中的内容，服务端渲染就是直接把完整的ＨＭＴＬ返回给浏览器进行渲染的，而客户端渲染是通过ｊｓ进行加载的，爬虫无法识别ｊｓ文件中的内容

**开发效率**：客户端渲染的开发效率要高于服务端渲染。客户端渲染开发是前后端分离，效率更高。服务端渲染增加了前后端的耦合性，开发难度提高，效率降低

**直观的区分客户端渲染和服务端渲染：**网页源码里面可以直接看到网页内容的是服务端渲染，否则，就是客户端渲染，通过bundle.js文件来进行页面渲染



## 二. 项目工程化

### 2.1 项目目录

**新建项目目录 `service-render-01`,项目结构如下**

> `webpack.server.js`: webpack 打包配置文件
>
> `.gitignore`: git操作提交的时候忽略上传的配置
>
> `package.json`: node项目配置
>
> `src>index.js`: 项目入口文件，用于写服务端代码
>
> `src/containers/Home/index.js`: 项目第一个组件，用于展示初始化页面

![image-20200917202932212](./React服务端渲染.assets/image-20200917202932212.png)

### 2.2 package.json文件

> 对于经验不够丰富的开发者而言，package.json文件的配置是很容易对项目运行产生报错的，因为存在很多node插件版本冲突问题
>
> 所以这里先给出一套具体版本的安装包，如果想自己配置相关插件版本，可能会存在一些版本兼容性问题，请自行到  [stackoverflow](https://stackoverflow.com/questions) 寻找解决方案

~~~js
{
  "name": "ServerRenderDemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon --watch build --exec node './build/bundle.js'",
    "dev:build": "webpack --config webpack.server.js --watch"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "babel-core": "6.26.3",
    "babel-loader": "7.1.5",
    "babel-preset-env": "1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "6.24.1",
    "babel-preset-stage-0": "6.24.1",
    "express": "4.16.3",
    "react": "16.4.1",
    "react-dom": "^16.13.1",
    "webpack": "4.16.0",
    "webpack-node-externals": "1.7.2"
  },
  "devDependencies": {
    "webpack-cli": "3.0.8"
  }
}

~~~

### 2.3 入口文件

**src/index.js**

~~~js
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from './containers/Home'

const app = express()
const content = renderToString(<Home />)

app.get('/',(req,res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSR Demo</title>
    </head>
    <body>
        ${content}
    </body>
    </html>
    `)
})

app.listen(3000,function(){
    console.log('Server running on localhost:3000...')
})
~~~

### 2.4 webpack配置文件

**webpack.server.js**

~~~js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    // 指定执行目标环境
    target: 'node',
    // 指定运行模式
    mode: 'development',
    // webpack打包入口文件
    entry: './src/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'./build')
    },
    externals : [nodeExternals()],

    // 配置js文件解析规则，ES6转化，react代码识别
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader:'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react','stage-0',['env',{
                        targets: {
                            browsers: ['last 2 versions']
                        }
                    }]]
                }
            }
        ]
    }
}
~~~

### 2.5 首个页面

~~~js
import React from 'react'

const Home = () =>{
    return (<div>Welcome to Home--可修改内容测试</div>)
}

export default Home
~~~

### 2.6 运行项目

> 以上代码准备就绪之后就可以安装依赖，打包，运行了

- **安装依赖**：进入项目根目录，`yarn add` 或者 `cnpm install`
- **执行打包命令**：`npm run dev:build`
- **开启服务器并监听文件修改和打包**：`npm run dev`

打开浏览器访问：`localhost:3000`，出现以下页面即运行成功，可以修改 `src/Home/index.js` 文件中的内容并保存，刷新浏览器检查文件修改是否被监听，刷新浏览器页面更新即证明监听成功

![image-20200917205433196](./React服务端渲染.assets/image-20200917205433196.png)

### 2.7 项目完整源码

[点击前往下载:service-render-01](https://github.com/mapengfei47/React-Service-Render)



## 三. 项目同构

> **同构**：同样一套代码，在服务端执行一遍，在客户端也执行一遍

### 3.1 存在问题

在上述项目里面，我们修改一下 `home` 组件，在 `home` 组件中添加一个按钮，并且为按钮绑定一个事件

~~~js
// Home/index.js
import React from 'react'

const Home = () =>{
    return (<div>
        <h1>Welcome to React 同构</h1>
        <button onClick={() => alert('同构成功')}>Click Me</button>
    </div>)
}

export default Home
~~~

然后运行项目，会发现，按钮虽然已经展示出来，但是绑定的事件并没有生效

**问题说明：** 服务端运行生成的HTML返回给客户端的时候，元素绑定的事件是不生效的，服务端渲染出来的内容，不会带事件绑定

### 3.2 同构流程

针对上面提出的问题，我们通过同构来解决该问题，同构原理流程如下

![image-20200920140633104](./React服务端渲染.assets/image-20200920140633104.png)

在上面项目工程化的介绍中，同构步骤的1，2，3步其实已经完成了，接下来看一下4，5，6步怎么做

### 3.3 同构实现

**1. 浏览器加载JS文件**

- 要想浏览器加载j s文件，我们直接在服务器端完成渲染，返回给浏览器的 `html` 代码中插入一个 `<script>标签即可`
- 在模版字符串中新增了 `<div id='root'></div>` 包裹服务端返回的HTML，后面通过 `ReactDOM.render()` 绑定到该节点上面去

~~~js
// server/index.js
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from '../containers/Home'

const app = express()
const content = renderToString(<Home />)
// 指定静态文件，页面中加载的静态文件会去该目录下面查找
app.use(express.static('public'))

app.get('/',(req,res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSR Demo</title>
    </head>
    <body>
        <div id='root'>${content}</div>
        <script src='./index.js'></script>
    </body>
    </html>
    `)
})

app.listen(3000,function(){
    console.log('Server running on localhost:3000...')
})
~~~

**2. 加载的JS文件**

~~~js
// src/client/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import Home from '../containers/Home'

ReactDOM.hydrate(<Home />,document.getElementById('root'))
~~~

**3. webpack打包配置**

在这里直接优化一下 `webpack` 打包配置

- 将客户端打包配置，服务端打包配置，通用配置分别提取出来，通过 `webpack-merge` 分别在客户端配置和服务端配置中合并通用配置
- 💡注意：要先安装 `webpack-merge` 第三方包，在旧包中，该模块直接返回 `merge` 函数可以直接调用，在新包中，返回一个对象，通过这个对象去调用 `merge` 函数

~~~js
//webpack.base.js
module.exports = {
    // 配置js文件解析规则，ES6转化，react代码识别
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader:'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react','stage-0',['env',{
                        targets: {
                            browsers: ['last 2 versions']
                        }
                    }]]
                }
            }
        ]
    }
}
~~~

~~~js
// webpack.client.js
const path = require('path')
const webpackMerge = require('webpack-merge')
const config = require('./webpack.base')

let clientConfig = {
    // 指定运行模式
    mode: 'development',
    // webpack客户端打包入口文件
    entry: './src/client/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname,'./public')
    },
}

module.exports = webpackMerge.merge(config ,clientConfig)
~~~

~~~js
// webpack.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpackMerge = require('webpack-merge')
const config = require('./webpack.base')

let serverConfig = {
    // 指定执行目标环境
    target: 'node',
    // 指定运行模式
    mode: 'development',
    // webpack打包入口文件
    entry: './src/server/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'./build')
    },
    externals : [nodeExternals()],
}

module.exports = webpackMerge.merge(config,serverConfig)
~~~

**4. 修改package.json的script**

~~~json
{
  ...
  "scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:build:server": "webpack --config webpack.server.js --watch",
    "dev:build:client": "webpack --config webpack.client.js --watch",
    "dev:start": "nodemon --watch build --exec node ./build/bundle.js"
  },
  ...
}
~~~

**5. 重新运行即可**

点击按钮，浏览器弹出弹框，同构成功

![image-20200920143314505](./React服务端渲染.assets/image-20200920143314505.png)

### 3.4 项目完整代码

[点击前往下载:service-render-02](https://github.com/mapengfei47/React-Service-Render)

### 3.5 总结

1. 同构就是将同样一套代码，在服务端执行一次（提升首屏渲染速度，更好的SEO），在客户端再执行一次（绑定事件）
2. 同构渲染流程如下
   - 服务器运行React代码，并将React代码渲染成HTML返回给浏览器，浏览器接收到HTML直接渲染，此时渲染已经完成
   - 浏览器渲染完成HTML之后，加载JS文件，此时页面的操作权又回到React手上，React将绑定事件之后的完整HTML替换到 root 标签内，同构完成



## 四. 服务端渲染中的路由

> 在服务端渲染中使用路由，也需要在服务端运行一次，在客户端再运行一次

### 4.1 安装

~~~js
npm install react-router-dom -S
~~~

### 4.2 路由配置

1. 在 `src` 目录下新增 `Routes/index.js` 文件

~~~js
// src/Routes/index.js
import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/Home'
import Login from './containers/Login'

export default (
    <div>
        <Route path="/" exact component={Home}></Route>
        <Route path="/login" component={Login}></Route>
    </div>
)
~~~

2. 客户端运行的路由配置

**注意：** 客户端使用的是 `BrowserRouter` 包裹路由配置，不同于服务端

~~~js
//src/client/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Routes from '../Routes'
const App = () =>{
    return (
        <BrowserRouter>
            {Routes}
        </BrowserRouter>
    )
}

ReactDOM.hydrate(<App />,document.getElementById('root'))
~~~

3. 服务端运行的路由配置

**注意：** 服务端使用的是 `StaticRouter` 包裹路由配置，不同于客户端。并且要接收 `locatoin` 和 `context` 两个参数，这里 `location` 是URL指向（服务端不同于客户端的点，客户端在浏览器可以直接获取URL得知跳转地址，而服务端必须通过参数传递），`context` 是上下文参数（后续会详细介绍）

这里将 `src/server/index.js` 文件优化了一下，提取出工具类的方法 `render` 函数，路由的配置以及HTML的拼接全部放在 `render` 函数，直接返回给服务端完整的HTMl

~~~js
//src/server/index.js
import express from 'express'
import React from 'react'
import { render } from './utils'


const app = express()
// 指定静态文件，页面中加载的静态文件会去该目录下面查找
app.use(express.static('public'))

app.get('*',(req,res) => {
    res.send(render(req))
})

app.listen(3000,function(){
    console.log('Server running on localhost:3000...')
})
~~~

~~~js
//src/server/utils.js

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Routes from '../Routes'

export const render = (req) =>{

    const content = renderToString((
        <StaticRouter location={req.path} context={{}}>
            {Routes}
        </StaticRouter>
    ))

    let htmlStr = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SSR Demo</title>
        </head>
        <body>
            <div id='root'>${content}</div>
            <script src='./index.js'></script>
        </body>
        </html>
    `

    return htmlStr;
}
~~~

### 4.3 跳转链接Link

完成上述步骤，我们可以重新打包运行项目，在浏览器输入 `localhost:3000/login` 和 `localhost:/3000` 分别可以看到不同的页面跳转，说明我们的路由配置成功。

接下来，我们加上Link标签，指定跳转链接，就可以直接在页面上通过鼠标点击进行跳转了

我们想让跳转的链接在每一个页面上都显示，所以这里我们声明一个公用Header组件，来让每一个页面直接引用

~~~js
//src/components/Header/index.js

import React from 'react'
import { Link } from 'react-router-dom'

const Header = () =>{
    return (<div>
        <Link to="/">Home</Link>
        <br />
        <Link to="/login">Login</Link>
    </div>)
}

export default Header
~~~

~~~js
//src/containers/Home/index.js

import React from 'react'
import Header from '../../components/Header'

const Home = () =>{
    return (<div>
        <Header />
        <h1>Welcome to React 同构</h1>
        <button onClick={() => alert('同构成功')}>Click Me</button>
    </div>)
}

export default Home
~~~

Login页面同Home

完成之后，重新打包运行

![Cj9fKwkh3D](./React服务端渲染.assets/Cj9fKwkh3D.gif)

### 4.4 项目完整代码

[点击前往下载:service-render-03](https://github.com/mapengfei47/React-Service-Render)

### 