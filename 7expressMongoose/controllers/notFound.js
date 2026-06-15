const getNotFoundController = (req, res, next) => {

  res.status(404).render('not-found', {
    path: 'null',
    docTitle: 'Page Not Found',
    isLoggedIn: req.session.isLoggedIn
  })
}

const getServerErrorPageController = (req, res, next) => {
  res.status(500).render('500Error', {
    path: '500Error',
    docTitle: 'Internal Server Error',
    isLoggedIn: req.session.isLoggedIn
  })
}

module.exports = {
  getNotFoundController,
  getServerErrorPageController
}