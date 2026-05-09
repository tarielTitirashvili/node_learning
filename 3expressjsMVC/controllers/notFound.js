const getNotFoundController = (req, res, next) => {

  res.status(404).render('not-found', {
    path: 'null',
    docTitle: 'Page Not Found',
  })
}

module.exports = getNotFoundController