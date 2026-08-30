const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

const User = require('../models/user')
const { loginController, getStatusController } = require('../controllers/auth')

describe('Auth Controller - Login', function () {
  it('should throw error if DB access fails', function (done) {

    const req = {
      body: {
        email: 'tariel',
        password: 'tariel'
      }
    }

    sinon.stub(User, 'findOne')
    User.findOne.throws()
    loginController(req, {}, () => { }).then(result => {
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500)
      done()
    })
    User.findOne.restore()
  })
})


describe('Auth Controller - GetStatus', function () {
  before(function (done) {
    mongoose.connect(process.env.DB_URI_TEST)
      .then(res => {
        const user = new User({
          email: 'test@test.com',
          password: 'testPassword',
          name: 'test',
          posts: [],
          _id: '6a57f90c4f59666fbaf0ee0f'
        })
        return user.save()
      }).then(() => done())
  })
  it('should should return valid user status for existing user!', function (done) {
    const req = {
      userId: '6a57f90c4f59666fbaf0ee0f'
    }
    const res = {
      statusCode: 500,
      status: null,
      json: function (data) {
        this.status = data.status
      }
    }
    getStatusController(req, res, () => { })
      .then(() => {
        expect(res.status).to.be.equal('I am new')
        done()
      })
      .catch(err => console.log(err))
  })
  after(function (done) {
    User.deleteMany({}).then(() => {
      mongoose.disconnect().then(() => {
        done()
      })
    })
  })
})