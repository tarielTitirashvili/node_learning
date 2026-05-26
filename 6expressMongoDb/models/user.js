const mongodb = require('mongodb')
const { getDB } = require('../util/database')


const getUsersDB = () => {
  const db = getDB()
  return db
    .collection('users')
}

class User {
  constructor(name, email, cart, _id) {
    this.name = name
    this.email = email
    this.cart = cart
    this._id = _id ? _id : null
  }

  save() {
    return getUsersDB()
      .insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })

    let newQuantity = 1
    const updatedCartItems = this.cart?.items?.length ? this.cart.items : []

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
    }


    const updatedCart = { items: updatedCartItems }
    return getUsersDB().updateOne(
      { _id: this._id },
      { $set: { cart: updatedCart } }
    ).catch(error => console.error('search ERROR', error))
  }

  getCart() {
    const productIds = this.cart.items.map(i => i.productId)
    const db = getDB()
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return { ...p, quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity }
        })
      })
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId.toString())
    const updatedCart = { items: updatedCartItems }
    return getUsersDB()
      .updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      )
  }

  getOrders() {
    const db = getDB()
    return db.collection('orders')
      .find({ 'user._id': new mongodb.ObjectId(this._id) })
      .toArray()
  }

  order() {
    const db = getDB()
    this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
            email: this.email
          }
        }
        return db.collection('orders').insertOne(order)
      })
      .then(dbRes => {
        return getUsersDB()
          .updateOne(
            { _id: this._id },
            { $set: { cart: { items: [] } } }
          )
      })
      .catch(err => console.log(err))
  }

  static fetchById(_id) {
    return getUsersDB()
      .find({ _id: new mongodb.ObjectId(_id) })
      .next() // next returns only first founded element
      .then(user => {
        return user
      })
  }
}


module.exports = User