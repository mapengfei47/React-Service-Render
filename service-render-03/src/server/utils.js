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