const { getDB } = require('../util/database')
const mongodb = require('mongodb')

const getProductsDB = () => {
  const db = getDB()
  return db
    .collection('products')
}

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectId(id) : null
  }

  save() {
    let dbOp
    if (this._id) {
      dbOp = getProductsDB().updateOne({_id: new mongodb.ObjectId(this._id)}, { $set: this })
    } else {
      dbOp = getProductsDB()
        .insertOne(this)
    }
    return dbOp
  }
  static fetchAll() {
    return getProductsDB()
      .find()
      .toArray()
      .then(
        products => {
          console.log(products)
          return products
        }
      )
      .catch(
        err => console.error(err)
      )
  }

  static findProduct(_id) {
    return getProductsDB()
      .find({ _id: new mongodb.ObjectId(_id) })
      .next()
      .then(
        products => {
          return products
        }
      )
  }

  static deleteById (_id){
    return getProductsDB().deleteOne({_id: new mongodb.ObjectId(_id)})
  }

}

module.exports = Product