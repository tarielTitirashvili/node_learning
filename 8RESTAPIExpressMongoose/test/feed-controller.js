const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')
const io = require('../socket')
const dotenv = require("dotenv")
dotenv.config()

const User = require('../models/user')
const { postCreatePost } = require('../controllers/feed')

describe('Feed Controllers', function () {
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
  it('should add new post to the posts off creator', function (done) {
    const req = {
      userId: '6a57f90c4f59666fbaf0ee0f',
      file: {
        path: '/test/path/tofile.jpg'
      },
      body: {
        title: 'test title',
        content: 'test post content'
      }
    }
    const res = {
      status: function () {
        return this
      },
      json: function () { },
    }

    sinon.stub(io, 'getIo')
    io.getIo = function(){
      return {
        emit: ()=>{}
      }
    }
    postCreatePost(req, res, () => { })
      .then(savedUser => {
        console.log(savedUser)
        expect(savedUser).to.have.property('posts')
        expect(savedUser.posts).to.have.length(1)
        done()
      }).catch(err => console.log(err))
  })
  after(function (done) {
    User.deleteMany({}).then(() => {
      mongoose.disconnect().then(() => {
        done()
      })
    })
  })
})