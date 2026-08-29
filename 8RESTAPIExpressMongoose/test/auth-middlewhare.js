const { isAuth } = require('../middleware/is-auth')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

describe('isAuth middleware', () => {

  it('should throw error when no authorization header is present', function () {
    const req = {
      get: function () {
        return undefined
      }
    }
    expect(isAuth.bind(this, req, {}, () => { })).to.throw('Not authenticated')
  })

  it('should throw error if JWT not provided', function () {
    const req = {
      get: function () {
        return 'tariel'
      }
    }
    expect(isAuth.bind(this, req, {}, () => { })).to.throw()
  })

  it('should throw error if the token is not verified', function () {
    const req = {
      get: function () {
        return 'Bearer tariel'
      }
    }

    expect(isAuth.bind(this, req, {}, () => { })).to.throw()
  })

  it('should add userid in res object if verified token', function () {
    const req = {
      get: function () {
        return 'Bearer tariel'
      }
    }

    sinon.stub(jwt, 'verify')
    jwt.verify.returns({
      userId: 'tariel'
    })

    isAuth(req, {}, () => { })
    expect(req).to.have.property('userId')
    expect(req).to.have.property('userId', 'tariel')
    expect(jwt.verify.called).to.be.true
    jwt.verify.restore()
  })
})