const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if(!authHeader){
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  let decodeToken
  try {
    decodeToken = jwt.verify(token, process.env.SECRET)
  } catch {
    req.isAuth = false
    return next()
  }
  if (!decodeToken) {
    req.isAuth = false
    return next()
  }

  req.userId = decodeToken.userId
  req.isAuth = true
  next()
}

module.exports = {
  isAuth
}