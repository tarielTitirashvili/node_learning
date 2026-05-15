const Product = require('../models/product')

const getAddProductController = (req, res, next) => {

  res.render('admin/add-product', { path: '/admin/add-product', docTitle: 'Add Product' })
}

const postAddProductController = (req, res, next) => {
  try {
    const {title, imageURL, description, price} = req.body
    
    const product = new Product(null, title, imageURL, description, price)
    product.save()

    res.redirect('/')
  } catch (e) {
    console.error('error ', e)
  }
}

const getProductsForAdminController = (req, res, next) => {

  Product.fetchAll((products) => {

    res.render('admin/products', {
      docTitle: 'Admin Products',
      products,
      path: '/admin/products',
    })
  })
}

const getEditProductController = (req, res, next) => {

  const productId = req.params.productId

  Product.fetchSingleProduct(productId, product =>{
    res.render('admin/edit-product', { path: '/admin/add-product', docTitle: 'Add Product', product})
  })
}

const postEditProductController = (req, res, next) =>{
  const pId = req.body.id
  const pTitle = req.body.title
  const pImageURL = req.body.imageURL
  const pDescription = req.body.description
  const pPrice = req.body.price

  const editedProduct = new Product(pId, pTitle, pImageURL, pDescription, pPrice)
  editedProduct.save()
  res.redirect('/admin/products')
}


module.exports = {
  getAddProductController,
  postAddProductController,
  getProductsForAdminController,
  getEditProductController,
  postEditProductController,
}