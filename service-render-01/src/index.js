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