const Product = require('../models/product')

const getAddProductController = (req, res, next) => {

  res.render('admin/add-product', { path: '/admin/add-product', docTitle: 'Add Product' })
}

const postAddProductController = (req, res, next) => {
  try {
    const { title, imageURL, description, price } = req.body
    console.log('req.body',)
    req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageURL || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
      description: description,
      userId: req.user.id
    })
      .then(dbRes => {
        console.log('dbRes', dbRes)
        res.redirect('/')
      })
      .catch(err => console.error(err))

  } catch (e) {
    console.error('error ', e)
  }
}

const getProductsForAdminController = (req, res, next) => {

  req.user.getProducts().then((products) => {
    console.log(products)
    res.render('admin/products', {
      docTitle: 'Admin Products',
      products,
      path: '/admin/products',
    })
  }).catch(err => console.error(err))
}

const getEditProductController = (req, res, next) => {

  const productId = req.params.productId

  req.user.getProducts({ where: { userId: productId } })
    .then(
      products => {
        const product = products[0]
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

  Product
    .findByPk(pId)
    .then((product) => {
      product.title = pTitle
      product.imageUrl = pImageURL
      product.description = pDescription
      product.price = pPrice
      return product.save()
    })
    .then(dbRes => {
      console.log('successResponse', dbRes)
      res.redirect('/admin/products')
    })
    .catch(err => console.error(err))
}

const deleteProductController = (req, res, next) => {
  const productId = req.body.id

  Product.destroy({
    where: {
      id: productId,
    },
  })
    .then(dbRes => {
      console.log('error Success Message DB', dbRes)
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