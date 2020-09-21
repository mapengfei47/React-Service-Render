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