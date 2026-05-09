const Product = require('../models/product')

const getAddProductController = (req, res, next) => {

  res.render('admin/add-product', { path: '/admin/add-product', docTitle: 'Add Product' })
}

const postAddProductController = (req, res, next) => {
  try {
    console.log('req.body', req.body)
    const {title, imageURL, description, price} = req.body
    
    const product = new Product(title, imageURL, description, price)
    product.save()

    res.redirect('/')
  } catch (e) {
    console.error('error ', e)
  }
}

const getProductsForAdminController = (req, res, next) => {

  Product.fetchAll((products) => {
    console.log('products', products)

    res.render('admin/products', {
      docTitle: 'Admin Products',
      products,
      path: '/admin/products',
    })
  })
}


module.exports = {
  getAddProductController,
  postAddProductController,
  getProductsForAdminController
}