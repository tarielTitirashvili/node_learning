const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const { loginController } = require('../controllers/auth')

describe('Auth Controller - Login', function(){
  it('should throw error if DB access fails', function(done){

    const req = {
      body: {
        email: 'tariel',
        password: 'tariel'
      }
    }

    sinon.stub(User, 'findOne')
    User.findOne.throws()
    loginController(req, {}, ()=>{}).then(result=>{
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500)
      done()
    })
    User.findOne.restore()
  })
})