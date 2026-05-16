const http = require('http')
// const path = require('path')
const requestsHandler = require('./routes')

const PROT = 4000

const server = http.createServer(requestsHandler)

server.listen(PROT, () => {
  console.log(`server is up on http://localhost:${PROT}/`)
})