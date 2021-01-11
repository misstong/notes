// const obj = {
//     get foo(){
//         console.log(this)
//         return this.bar
//     }

// }

// const proxy = new Proxy(obj, {
//     get (target, key, receiver){
//         if(key === 'bar'){
//             return 'value - bar'
//         }
//         console.log('---',target,key,receiver)
//         return Reflect.get(target, key)
//     }
// })

// console.log(proxy.foo)

function reduceDim(arr, depth){
    let curQueue=[]
    let nextQueue =[]
    curQueue.push(arr)
    console.log(curQueue)
    let curDepth =0
    let hasNext=true
    while(hasNext) {
      hasNext=false
      console.log('curDepth',curDepth, curQueue)
      while(curQueue.length) {
        let item = curQueue.shift()
        console.log('item', item)
        if (item instanceof Array) {
          for (i of item){
            // console.log('i',i)
            nextQueue.push(i)
            hasNext=true
          }   
        }else {
          nextQueue.push(item)
        }
      }
      curDepth++
      if (curDepth===depth) return nextQueue
      let tmp = curQueue 
      curQueue = nextQueue
      nextQueue = tmp
    }
    return curQueue;
  }
  Array.prototype.flatFn = function (depth) {
    let result =[]
  
    if (depth===undefined) depth=1
    if (depth ==0) return this
    const originArray = this;
    const length = originArray.length
    for (let i=0;i<length;i++) {
      let item = originArray[i]
      if (item instanceof Array) {
        let sub = reduceDim(item, depth)
        console.log('sub',sub)
        result=result.concat(sub)
      } else {
        result.push(item)
      }
    }
    return result
  }

  let a=[1,2,[3]]
  let b=[1,[2],3,[[4]]]
 console.log(a.flatFn(1))
 console.log(b.flatFn(2))