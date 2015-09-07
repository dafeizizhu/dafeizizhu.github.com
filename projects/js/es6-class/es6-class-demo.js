var Animal = Class.extend({
  statics: {
    TestStaticsProperty: 1,
    TestStaticsProperty2: 2,
    TestStaticsMethod: function () {
      return 2
    },
    TestStaticsMethod2: function () {
      return 33
    }
  },
  ctor: function (age) {
    this.age = age
    this.testProp = 'animal'
  },
  eat: function () {
    return 'nice'
  },
  drink: function () {
    return 'good'
  }
})

var Pig = Animal.extend({
  statics: {
    TestStaticsProperty2: 3,
    TestStaticsMethod2: function () {
      return 3
    }
  },
  ctor: function (age, name) {
    this._super(age)
    this.name = name
  },
  climbTree: function () {
    return this._super.eat()
  },
  eat: function () {
    return 'very nice'
  }
})

var BigPig = Pig.extend({
  ctor: function () {
    console.log(typeof this._super == 'function')
  },
  getSuper: function () {
    return this._super
  }
})


console.log('Animal.TestStaticsProperty == 1', Animal.TestStaticsProperty == 1)
console.log('Animal.TestStaticsMethod() == 2', Animal.TestStaticsMethod() == 2)
console.log('Pig.TestStaticsProperty == 1', Pig.TestStaticsProperty == 1)
console.log('Pig.TestStaticsProperty2 == 3', Pig.TestStaticsProperty2 == 3)
console.log('Pig.TestStaticsMethod() == 2', Pig.TestStaticsMethod() == 2)
console.log('Pig.TestStaticsMethod2() == 3', Pig.TestStaticsMethod2() == 3)
console.log('Animal.TestStaticsMethod2() == 33', Animal.TestStaticsMethod2() == 33)
console.log('Animal.TestStaticsProperty2 == 2', Animal.TestStaticsProperty2 == 2)

var animal = new Animal(11)
console.log('animal.age == 11', animal.age == 11)
console.log('animal.eat() == \'nice\'', animal.eat() == 'nice')

var pig = new Pig(1, 11)
console.log('pig.testProp == \'animal\'', pig.testProp == 'animal')
console.log('pig.climbTree() == \'nice\'', pig.climbTree() == 'nice')
console.log('pig.eat() == \'very nice\'', pig.eat() == 'very nice')
console.log('pig instanceof Pig', pig instanceof Pig)

var bigPig = new BigPig()
console.log('bigPig.drink() == \'good\'', bigPig.drink() == 'good')
console.log('bigPig.testProp == \'animal\'', bigPig.testProp == 'animal')
console.log('bigPig.getSuper() instanceof Pig', bigPig.getSuper() instanceof Pig)
console.log('bigPig instanceof Animal', bigPig instanceof Animal)


console.log('Animal(11)', animal)
console.log('Pig(1, 11)', pig)
console.log('BigPig()', bigPig)
