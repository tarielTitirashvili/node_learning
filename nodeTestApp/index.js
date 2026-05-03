const http = require('http')
// const path = require('path')
const requestsHandler = require('./routes')

// console.log(path)
// console.log(http)
const PROT = 4000

const server = http.createServer(requestsHandler)

server.listen(PROT, () => {
  console.log(`server is up on http://localhost:${PROT}/`)
})