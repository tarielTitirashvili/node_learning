const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node_shop_app',
  password: '@NodeShopApp'
})

module.exports = pool.promise()