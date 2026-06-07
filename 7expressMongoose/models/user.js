const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
})

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  })

  let newQuantity = 1
  const updatedCartItems = this.cart?.items?.length ? this.cart.items : []

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
    console.log('updatedCartItems', updatedCartItems)
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity })
  }

  this.cart = { items: updatedCartItems }
  return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId.toString())
  console.log('updatedCartItems', updatedCartItems)
  this.cart = { items: updatedCartItems }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)
// const mongodb = require('mongodb')
// const { getDB } = require('../util/database')


// const getUsersDB = () => {
//   const db = getDB()
//   return db
//     .collection('users')
// }

// class User {
//   constructor(name, email, cart, _id) {
//     this.name = name
//     this.email = email
//     this.cart = cart
//     this._id = _id ? _id : null
//   }

//   save() {
//     return getUsersDB()
//       .insertOne(this)
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString()
//     })

//     let newQuantity = 1
//     const updatedCartItems = this.cart?.items?.length ? this.cart.items : []

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     } else {
//       updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
//     }


//     const updatedCart = { items: updatedCartItems }
//     return getUsersDB().updateOne(
//       { _id: this._id },
//       { $set: { cart: updatedCart } }
//     ).catch(error => console.error('search ERROR', error))
//   }

//   getCart() {

//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId.toString())
//     const updatedCart = { items: updatedCartItems }
//     return getUsersDB()
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: updatedCart } }
//       )
//   }

//   getOrders() {
//     const db = getDB()
//     return db.collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) })
//       .toArray()
//   }

//   order() {
//     const db = getDB()
//     return this.getCart()
//       .then(products => {
//         console.log('ORDER PRODUCTS', products)
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//             email: this.email
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(dbRes => {
//         return getUsersDB()
//           .updateOne(
//             { _id: this._id },
//             { $set: { cart: { items: [] } } }
//           )
//       })
//       .catch(err => console.log(err))
//       .catch(err => console.log(err))
//   }

//   static fetchById(_id) {
//     return getUsersDB()
//       .find({ _id: new mongodb.ObjectId(_id) })
//       .next() // next returns only first founded element
//       .then(user => {
//         return user
//       })
//   }
// }


// module.exports = User