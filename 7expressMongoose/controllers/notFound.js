const getNotFoundController = (req, res, next) => {

  res.status(404).render('not-found', {
    path: 'null',
    docTitle: 'Page Not Found',
    isLoggedIn: req.session.isLoggedIn
  })
}

module.exports = getNotFoundController