const fp = require('lodash/fp')
const _ = require('lodash')
//数据
//horsepower马力， dollar_value 价格，in_stock库存
const cars = [
    {name: 'Ferrari FF',horsepower:660,
    dollar_value:700000, in_stock: true},
    {name: 'Spyker C12 Zagato',horsepower:650,
    dollar_value:648000,in_stock:false},
    {name:'Jaguar XKR-S',horsepower:550,
    dollar_value:132000,in_stock:false},
    {name:'Audi R8',horsepower:525,
    dollar_value:114200,in_stock:false},
    {name:'Aston Martin One-77',horsepower:750,
    dollar_value:1850000,in_stock:true},
    {name:'Pagani Huayra',horsepower:700,
    dollar_value:1300000,in_stock:false}
]

let isLastInStock = function (cars) {
    //获取最后一条数据
    let last_car = fp.last(cars)
    //获取最后一条数据的in_stock属性值
    return fp.prop('in_stock', last_car)
}

let isLastInStock2 = fp.flowRight(fp.prop('in_stock'), fp.last)

console.log(isLastInStock(cars))
console.log(isLastInStock2(cars))
let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}

let averageDollarValue = function(cars) {
    let dollar_values = fp.map(function(car){
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}

let averageDollarValue2 = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))

console.log(averageDollarValue(cars))
console.log(averageDollarValue2(cars))

console.log(fp.lowerCase('Hello_ Word'))
let _underscore = fp.replace(/\W+/g, '_')
let sanitizeNames = fp.map(fp.flowRight(_underscore,fp.lowerCase))
console.log(sanitizeNames(['Hello Word']))

class Container {
    static of(value) {
        return Container(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x) {
        return new Maybe(x)
    }
    isNothing() {
        return this._value === null || this._value === undefined
    }
    constructor(x) {
        this._value = x
    }
    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}

let maybe = Maybe.of([5,6,1])
let ex1 = (x) => {
    //code 
    return fp.map(fp.add(x))
}
maybe.map(ex1(3))
console.log(maybe.map(ex1(3)))
console.log(fp.first('avc'))