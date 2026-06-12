const crypto = require('crypto')
const User = require('../models/user')
// ! because off bcrypt we cant get initial string it transforms string only one way and for example:
// ! if you have 2 is result off using % operator by 3 it can be from 5, 8, 11, 14, 17, ...
const bcrypt = require('bcryptjs')
const { mailSender } = require('../util/mailSender')
const { validationResult } = require('express-validator')


const getLoginPageController = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')?.split('=')?.[1] === 'true'
  // console.log(req.session)
  let errorMessage = req.flash('error')
  if (errorMessage.length) {
    errorMessage = errorMessage[0]
  } else {
    errorMessage = null
  }

  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: errorMessage,
    prevData: null,
    validationErrors: null
  })
}

const postLoginRequestController = (req, res, next) => {
  const { password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      docTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      prevData: req.body,
      validationErrors: 'error'
    })
  }

  bcrypt.compare(password, req.session.loginIdentifiedUserPassword)
    .then(correctPassword => {
      if (correctPassword) {
        req.session.userId = req.session.loginIdentifiedUserId
        req.session.isLoggedIn = true
        return req.session.save((err) => {
          console.log(err)
          req.flash('error', 'Invalid email or password')
          res.redirect('/')
        })
      } else {
        return res.render('auth/login', {
          path: '/login',
          docTitle: 'Login',
          errorMessage: errors.array()[0].msg,
          prevData: req.body,
          validationErrors: 'error'
        })
      }
    })
    .catch( //! if something goes wrong not wrong password
      err => {
        console.log(err)
        res.redirect('/login')
      }
    )
    .catch(err => console.error(err))
}

const postLogOutRequestController = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}

const getSignupPageController = (req, res, next) => {
  let errorMessage = req.flash('error')
  if (errorMessage.length) {
    errorMessage = errorMessage[0]
  } else {
    errorMessage = null
  }

  res.render('auth/signup', {
    path: 'auth/signup',
    docTitle: 'Sign Up',
    errorMessage,
    prevData: req.body,
    validationErrors: []
  })
}

const postSignupRequestController = (req, res, next) => {
  const errors = validationResult(req)
  const email = req.body.email
  const password = req.body.password

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: 'auth/signup',
      docTitle: 'Sign Up',
      errorMessage: errors.array()[0].msg,
      prevData: req.body,
      validationErrors: errors.array()
    })
  }

  return bcrypt.hash(password, 12).then(hashedPassword => {
    const user = new User({ email, password: hashedPassword, cart: { items: [] } })
    user.save()
      .then(
        result => {
          res.redirect('/')
          return mailSender(
            email,
            {
              subject: 'Registered'
            }
          )
            .then(mailRes => {
              // console.log(mailRes)
              return res.redirect('/')
            }).catch(err => {
              console.error('mailError', err)
            })
        }
      ).catch(err => {
        console.error('mailError', err)
      })
  }).catch(err => {
    console.error('mailError', err)
  })
}

const getResetPasswordPageController = (req, res, next) => {

  let errorMessage = req.flash('error')
  let successFlash = req.flash('success')
  if (errorMessage.length) {
    errorMessage = errorMessage[0]
  } else {
    errorMessage = null
  }

  if (successFlash.length) {
    successFlash = successFlash[0]
  } else {
    successFlash = null
  }

  res.render('auth/reset-password', {
    path: '/auth/reset-password',
    docTitle: 'Reset Password',
    errorMessage: errorMessage,
    successMessage: successFlash
  })
}

const postResetPasswordController = (req, res, next) => {
  const { email } = req.body

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash('error', 'Something went wrong!')
      res.redirect('/reset-password')
    } else {
      const token = buffer.toString('hex')
      User.findOne({ email })
        .then(user => {
          if (!user) {
            req.flash('error', 'No Account with That Email.')
            res.redirect('/reset-password')
          }
          user.resetToken = token
          user.resetTokenExpirationDate = Date.now() + 3600000
          return user.save()
        })
        .then(
          saveResult => {
            req.flash('success', 'Email was sent go Check It Out!')
            mailSender(
              email,
              {
                subject: 'Reset Password',
                html: `
                <h3>You requester Password Reset!</h3>
                <p> to go to Reset Password page <a href="http://localhost:9000/reset-password/${token}"> click here </a> </p>
                `
              }
            )
            res.redirect('/reset-password')
          }
        )
        .catch(err => {
          console.error(err)
        })
    }
  })
}

const getResetPasswordSessionPageController = (req, res, next) => {
  const token = req.params.token

  User.findOne({ resetToken: token, resetTokenExpirationDate: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Not Valid Session')
        return res.redirect('/login')
      }
      let errorMessage = req.flash('error')
      if (errorMessage.length) {
        errorMessage = errorMessage[0]
      } else {
        errorMessage = null
      }

      res.render('auth/reset-password-session', {
        path: '/auth/reset-password-session',
        docTitle: 'Reset Password',
        errorMessage: errorMessage,
        userId: user._id.toString(),
        token: token
      })
    })
    .catch(err => console.error(err))
}

const postResetPasswordSessionController = (req, res, next) => {
  const { token, userId, password, confirmPassword } = req.body
  if (confirmPassword === password) {
    User.findOne({ resetToken: token, _id: userId, resetTokenExpirationDate: { $gt: Date.now() } })
      .then(user => {
        if (!user) {
          res.redirect(`reset-password/${token}`)
        }
        bcrypt.hash(password, 12)
          .then(
            hashedPassword => {
              user.password = hashedPassword
              user.save().then(
                () => {
                  res.redirect('/login')
                  mailSender(user.email, { subject: 'Password was changed!', html: '<h2> password was updated! </h2>' })
                }
              )
            }
          )
      })
      .catch(err => {
        console.error(err)
      })
  } else {
    res.redirect(`reset-password/${token}`)
  }
}

module.exports = {
  getLoginPageController,
  postLoginRequestController,
  postLogOutRequestController,
  getSignupPageController,
  postSignupRequestController,
  getResetPasswordPageController,
  postResetPasswordController,
  getResetPasswordSessionPageController,
  postResetPasswordSessionController
}