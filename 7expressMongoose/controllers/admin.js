const Product = require('../models/product')
const mongodb = require('mongodb')

const getAddProductController = (req, res, next) => {

  res.render('admin/add-product', { path: '/admin/add-product', docTitle: 'Add Product'})
}

const postAddProductController = (req, res, next) => {
  try {
    const { title, imageURL, description, price } = req.body
    const imageUrl = imageURL ? imageURL : 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'

    const product = new Product({ title, price, description, imageUrl: imageUrl, userId: req.session.user._id })
    product.save()
      .then(
        result => {
          console.log('result', result)
          res.redirect('/admin/add-product')
        }
      )

  } catch (e) {
    console.error('error ', e)
  }
}

const getProductsForAdminController = (req, res, next) => {

  Product.find()
    // .select('-imageUrl -_id') // for example how can we select and remove data from DB
    .populate('userId', '-cart') // same here removes cart
    .then((products) => {
      // console.log('products', products)
      res.render('admin/products', {
        docTitle: 'Admin Products',
        products,
        path: '/admin/products',
      })
    }).catch(err => console.error(err))
}

const getEditProductController = (req, res, next) => {

  const productId = req.params.productId

  Product.findById(productId)
    .then(
      product => {
        // console.log('products', product)
        // const product = products.length ? products[0] : []
        res.render('admin/edit-product', { path: '/admin/add-product', docTitle: 'Add Product', product })
      }
    )
    .catch(err => console.error(err))

}

const postEditProductController = (req, res, next) => {
  const pId = req.body.id
  const pTitle = req.body.title
  const pImageURL = req.body.imageURL || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  const pDescription = req.body.description
  const pPrice = req.body.price

  Product.findById(pId)
    .then(product => {
      product.title = pTitle
      product.imageUrl = pImageURL
      product.price = pPrice
      product.description = pDescription

      return product.save()
    })
    .then(dbRes => {
      console.log('successResponse', dbRes)
      res.redirect('/admin/products')
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err))

}

const deleteProductController = (req, res, next) => {
  const productId = req.body.id

  Product.findByIdAndDelete(productId)
    .then(dbRes => {
      // console.log('error Success Message DB', dbRes)
      res.redirect('/admin/products')
    })
    .catch(err => console.error(err))

  // Product.delete(productId)

}


module.exports = {
  getAddProductController,
  postAddProductController,
  getProductsForAdminController,
  getEditProductController,
  postEditProductController,
  deleteProductController
}