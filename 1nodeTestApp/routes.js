const fs = require('fs')
const path = require('path')

function requestsHandler(req, res) {
  const url = req.url
  const method = req.method
  const dir = path.dirname(__filename)

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write('<h1>Home</h1>')
    res.write('<form action="/submit" method="POST"><input type="text" name="message"></input><button type="submit">submit</button></form>')
    res.end()
    return
  }
  if (url === '/submit' && method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      // console.log('chunk', chunk)
      body.push(chunk)
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      fs.writeFile(`${dir}/text.txt`, parsedBody.split('=')[1], error => {
        if (error) {
          res.statusCode = 500
          res.statusMessage = 'internal server error'
          res.end()
          return
        }
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
        return
      })
    })
  }
}

module.exports = requestsHandler