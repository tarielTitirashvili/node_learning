const User = require('../models/user')
// ! because off bcrypt we cant get initial string it transforms string only one way and for example:
// ! if you have 2 is result off using % operator by 3 it can be from 5, 8, 11, 14, 17, ...
const bcrypt = require('bcryptjs')

const getLoginPageController = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')?.split('=')?.[1] === 'true'
  // console.log(req.session)
  res.render('shop/login', {
    path: 'null',
    docTitle: 'Page Not Found',
  })
}

const postLoginRequestController = (req, res, next) => {
  const { email, password } = req.body
  User
    .findOne({ email: email })
    .then(user => {
      if (!user) {
        res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(correctPassword => {
          if (correctPassword) {
            req.session.userId = user._id.toString()
            req.session.isLoggedIn = true
            return req.session.save((err) => {
              console.log(err)
              res.redirect('/')
            })
          } else {
            res.redirect('/login')
          }
        })
        .catch( //! if something goes wrong not wrong password
          err => {
            console.log(error)
            res.redirect('/login')
          }
        )
    })
    .catch(err => console.error(err))
}

const postLogOutRequestController = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}

const getSignupPageController = (req, res, next) => {
  res.render('shop/signup', {
    path: 'null',
    docTitle: 'Page Not Found',
  })
}

const postSignupRequestController = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  if (password !== confirmPassword) {
    res.redirect('signup')
  }

  User.findOne({ email })
    .then(
      userDoc => {
        if (userDoc) {
          return res.redirect('/signup')
        } else {
          return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({ email, password: hashedPassword, cart: { items: [] } })
            user.save()
              .then(
                result => {
                  return res.redirect('/')
                }
              )
          })
        }
      }
    )
}

module.exports = {
  getLoginPageController,
  postLoginRequestController,
  postLogOutRequestController,
  getSignupPageController,
  postSignupRequestController,
}