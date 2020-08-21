const { reject } = require("lodash")

PENDING = 0
RESOLVED = 1
REJECTED = 2
class MyPromise {
    value = null
    status = PENDING
    reason = null
    success= []
    fail = []
    constructor(fn) {
        try {
            fn(this.resolve, this.reject)
        } catch(e) {
            this.reject(e)
        }
        
    }
    resolve = (val) =>{
        if (this.status !== PENDING) return;
        this.value = val;
        this.status = RESOLVED;
        while(this.success.length){
            this.success.shift()()
        }
    }
    reject = (e) => {
        if (this.status !== PENDING) return;
        this.reason = e
        this.status = REJECTED
       while(this.fail.length){
            this.fail.shift()()
        }
    }
    then(successCallback, failCallback) {
        successCallback = successCallback? successCallback: (val) => val
        failCallback = failCallback? failCallback: (val) => val
        let ret = new MyPromise((resolve, reject) =>{
            if (this.status===RESOLVED) {
                setTimeout(()=> {//同步代码此时promise已经有结果了，但是要引用ret需要延迟，所以加setTimeout
                    try {
                        let val = successCallback(this.value)
                        // resolve(val)
                        resolvePromise(ret, val,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                }, 0)             
            }else if (this.status ===REJECTED) {
                setTimeout(()=> {
                    try {
                        let val = failCallback(this.reason);
                        // resolve(val)
                        resolvePromise(ret, val,resolve,reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)       
            } else {
                let fn = () => {
                    setTimeout(()=> {
                        try {
                            let val = successCallback(this.value);
                            console.log(val)
                            // resolve(val)
                            resolvePromise(ret, val,resolve,reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                
                    
                }
                this.success.push(fn)

                let fn2 = () => {
                    setTimeout(()=> {
                        try {
                            let val = failCallback(this.reason);
                            // resolve(val)
                            resolvePromise(ret, val,resolve,reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)           
                }
                this.fail.push(fn2)

            }

        })
        return ret;
        
    }

    catch(fn) {
        this.then(undefined,fn)
    }
    finally(fn) {
        return this.then(fn, fn);
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve=> resolve(value))
    }

    static all(array) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve,reject) =>{
            function addData(i, val) {
                result[i]= val;
                index++;
                if (index===array.length) {
                    resolve(result)
                }
            }
            for(let i=0;i<array.length;i++) {
                let cur = array[i];
                if (cur instanceof MyPromise) {
                    cur.then((val)=>addData(i,val))
                }else {
                    addData(i,cur)
                }
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError("chain error"))
    }
    if(x instanceof MyPromise) {
        x.then((val) => {
            resolve(val)
        })
    } else {
        resolve(x)
    }
}
let p = new MyPromise((resolve, rejectet) => {
    setTimeout(()=>resolve(1), 0)
    // resolve(1)
    
})
let q=p.then((val)=>val+1)

setTimeout(()=>{
    console.log('p',p)
    console.log('q',q)
},2000)
