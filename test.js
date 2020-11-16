const obj = {
    get foo(){
        console.log(this)
        return this.bar
    }

}

const proxy = new Proxy(obj, {
    get (target, key, receiver){
        if(key === 'bar'){
            return 'value - bar'
        }
        console.log('---',target,key,receiver)
        return Reflect.get(target, key)
    }
})

console.log(proxy.foo)