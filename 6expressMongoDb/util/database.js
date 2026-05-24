const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callBack) => {

  MongoClient.connect(`mongodb+srv://tarielTitirashvili:xdGwE0V00yyYVQhK@nodeshopapp.1b9bnle.mongodb.net/?appName=nodeShopApp`)
    .then(client => {
      console.log('Connected To DB')
      _db = client.db()
      callBack(client)
    })
    .catch(err => {
      console.error('DB CONNECTION ERROR', err)
      throw err
    })
}

const getDB = () => {
  if (_db) {
    return _db
  } else {
    return
  }
}

module.exports = { mongoConnect, getDB }