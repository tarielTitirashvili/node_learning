const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if(!authHeader){
    const error = new Error('Not authenticated')
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(' ')[1]
  let decodeToken
  try {
    decodeToken = jwt.verify(token, process.env.SECRET)
  } catch {
    err.statusCode = 500
    throw err
  }
  if (!decodeToken) {
    const error = new Error('Not authenticated.')
    error.statusCode = 401
    throw error
  }

  req.userId = decodeToken.userId
  next()
}

module.exports = {
  isAuth
}