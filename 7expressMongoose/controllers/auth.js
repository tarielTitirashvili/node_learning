const User = require('../models/user')

const getLoginPageController = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')?.split('=')?.[1] === 'true'
  // console.log(req.session)
  res.render('shop/login', {
    path: 'null',
    docTitle: 'Page Not Found',
    isLoggedIn: req.session.isLoggedIn
  })
}

const postLoginRequestController = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
  User
    .findById('6a160e4a7bd99ee1ac98f6b4')
    .then(user => {
      req.session.userId = user._id.toString()
      req.session.isLoggedIn = true
      req.session.save((err) => {
        console.log(err)
        res.redirect('/')
      })
    })
    .catch(err => console.error(err))
}

const postLogOutRequestController = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}

module.exports = {
  getLoginPageController,
  postLoginRequestController,
  postLogOutRequestController
}