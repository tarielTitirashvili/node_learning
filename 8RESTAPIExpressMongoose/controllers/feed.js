const getFeedController = (req, res, next) => {
  res.status(200).json({
    posts: [{title: 'title', content: 'some random content!'}]
  })
}

const postCreatePost = (req, res, next) =>{
  const { title, content } = req.body
  console.log('req.body', req.body)
  res.status(201).json({
    message: 'post created',
  })
}


module.exports = {
  getFeedController,
  postCreatePost
}