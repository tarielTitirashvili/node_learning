const dude = {}
// ! dimich IT kamasutra has grate video to repeat everything on this topic
// ! https://www.youtube.com/watch?v=b55hiUlhAzI

console.log(dude.__proto__)
console.log(dude)

dude.name = 'tariel'
dude.age = 29

console.log(dude.__proto__)
console.log(dude)

const dude2 = Array([0,1])

console.log('Array.prototype', Array.prototype)
console.log('Array.__proto__', Array.__proto__)
console.log('Object.prototype', Object.prototype)
console.log('Object.__proto__', Object.__proto__.__proto__)

console.log(dude2.__proto__)
console.log(dude2.prototype)