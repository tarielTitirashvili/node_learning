const path = require('path')
const fs = require('fs')

const deleteImage = oldFilePath => {
  const filepath = path.join(__dirname, '..', oldFilePath)
  return fs.unlink(filepath, err => console.error(err))
}

module.exports = deleteImage