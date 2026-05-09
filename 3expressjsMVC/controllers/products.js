const products = []

const getProductsController = (req, res, next)=>{
  console.log('middleware!')

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
    products.push(req.body)
    res.redirect('/')
  } catch (e) {
    console.error('error ', e)
  }
}

module.exports = {
  getProductsController,
  getAddProductController,
  postAddProductController,
  products
}