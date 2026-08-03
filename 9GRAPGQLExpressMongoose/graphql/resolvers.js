const User = require('../models/user')
const bcrypt = require('bcryptjs')
const validator = require('validator')

module.exports = {
  createUser: async function (args, req) {
    const email = args.userInput.email
    const name = args.userInput.name
    const password = args.userInput.password

    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Invalid email' })
    }
    if (!validator.isEmpty(password) || !validator.isLength(password, { min: 3})) {
      errors.push({ message: 'Not Valid Password' })
    }
    if (!validator.isEmpty(name) || !validator.isLength(name, { min: 3})) {
      errors.push({ message: 'not valid name' })
    }

    if(errors.length){
      const error = new Error("Invalid input")
      error.data = errors
      error.code = 411
      throw error
    }

    const user = await User.findOne({ email })
    if (user) {
      const error = new Error('User Already Exists')
      throw error
    }
    const hashedPW = await bcrypt.hash(password, 12)

    const newUser = new User({
      email,
      name,
      password: hashedPW
    })
    const createdUser = await newUser.save()
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    }
  }
}