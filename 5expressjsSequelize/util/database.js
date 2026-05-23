const Sequelize = require('sequelize')
const mysql = require('mysql2')

const sequelize = new Sequelize('node_shop_app', 'root', '@NodeShopApp', {
  dialect: 'mysql',
  host: 'localhost'
})

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node_shop_app',
//   password: '@NodeShopApp'
// })

// module.exports = pool.promise()
module.exports = sequelize