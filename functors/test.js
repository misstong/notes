const fs = require('fs')
const fp = require('lodash/fp');
const { pick } = require('lodash');

class IO {
    static of (value) {
        return new IO(function() {
            return value;
        })
    }

    constructor(fn) {
        this._value = fn;
    }

    map(fn) {
        console.log(fn)
        console.log(this._value())
        console.log(fp.flowRight(fn, this._value))
        return new IO(fp.flowRight(fn, this._value))
    }

    join() {
        return this._value()
    }

    flatMap(fn) {
        return this.map(fn).join()
    }

}

let readFile = function(filename) {
    return new IO(function() {
        return fs.readFileSync(filename, 'utf-8')
    })
}

let print = function(x) {
    return new IO(function() {
        // console.log(x);
        return x
    })
}

let r = readFile('package.json').flatMap(print).join()
// console.log(r)




