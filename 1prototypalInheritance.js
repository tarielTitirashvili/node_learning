class Human {
  constructor(age){
    this.age = age
  }
  //! all methods will stay here
  talk(){
    return'human talks' + this.age
  }
}

// class TarielsClones extends Human {
//   constructor(age, version){
//     super(age)
//     this.version = version
//   }
// }

console.log('Human.__proto__', Human.__proto__)
console.log('new Human', new Human(1))
console.log('new Human', new Human(2).__proto__)
console.log('new Human', new Human(3).prototype)
const me = new Human(4)
me.__proto__.talk = function(){
  return 'tariel'
}

const you = new Human(5)

console.log('you talking', you)


function Person() {
  this.talk = function () {
    return 'talking'
  }
}

const lasha = new Person()

//! lasha OBJ0 will have talk in it's own object not in parent object 
//! so we can't rewrite it for all child objects off Person constructor function like in classes so inheritance is kinda braking
//! in old times we would add method talk to Person constructor function to emulate inheritance
console.log('lasha', lasha)
console.log('lasha talk', lasha.talk())
console.log('lasha __proto__', lasha.__proto__)

const car = {
  runningHours: 5,
  run(){
    return 'running ' + this.runningHours
  }
}

const prius = {
  runningHours: 12
}

Object.setPrototypeOf(prius, car)
console.log(prius.run())
console.log(prius)

console.log(Object.create(car))
