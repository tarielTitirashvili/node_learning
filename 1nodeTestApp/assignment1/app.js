const http = require('http')

http.createServer(
  function (req, res) {
    const method = req.method
    const url = req.url

    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write('<h1>Hello!!!</h1>')
      res.write('<form action="/create-user" method="POST"><input placeholder="user" type="text" name="user"></input><button type="submit">submit</button></form>')
      res.end()
      return
    }
    if (url === '/users') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write('<ul><li>user 1</li><li>user 9</li><li>user 0</li><li>user 5</li></ul>')
      res.end()
      return
    }
    if (url === '/create-user' && method === 'POST') {
      const body = []
      req.on('data', (chunk)=>{
        body.push(chunk)
      })
      req.on('end', (error)=>{
        const parsedBody = Buffer.concat(body).toString()
        const splittedBody = parsedBody?.split('=')
        if(parsedBody.includes('=') && splittedBody.length > 2){
          console.log('new user name', splittedBody[1])
        }
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
        return
      })
    }

  }
).listen(4000, () => {
  console.log('server running on 4000 port')
})