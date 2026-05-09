const Product = require('../models/product')

const getProductsController = (req, res, next)=>{
  console.log('middleware!')
  const products = Product.fetchAll()
  console.log(products)
  res.render('shop', {
    docTitle: 'shop',
    products,
    path: '/',
  })
}

const getAddProductController = (req, res, next) => {

  res.render('add-product', { path: '/admin/add-product', docTitle: 'Add Product' })
}

const postAddProductController = (req, res, next) => {
  try {
    console.log('req.body', req.body)
    const product = new Product(req.body.title) 
    product.save()

    res.redirect('/')
  } catch (e) {
    console.error('error ', e)
  }
}

module.exports = {
  getProductsController,
  getAddProductController,
  postAddProductController,
}