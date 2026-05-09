const fs = require('fs')
const path = require('path')
const rotDir = require('../util/path')

const productsFileDir = path.join(rotDir, 'data', 'products.json')

const getProductsFromFile = (cb) =>{
  fs.readFile(productsFileDir, (err, fileContent)=>{
    if(err){
      return cb([])
    }
    return cb(JSON.parse(fileContent))
  })
}

class Product {
  
  constructor(productTitle){
    this.title = productTitle
  }
  save() {
    // const productsFilePath = path.join(rotDir, 'data', 'products.json')
    getProductsFromFile((products)=>{
      products.push(this)
      fs.writeFile(productsFileDir, JSON.stringify(products), (err)=>{
        if(err){
          console.log(err)
        }
      })
    })
  }
  static fetchAll(cb){
    getProductsFromFile(cb)
  }
}

module.exports = Product