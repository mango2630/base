const handle = {
    get(target, prop, receiver) {
        console.log('get');
        if (typeof target[prop] === 'object') {
            return new Proxy(target[prop], handle);
        } else {
            return Reflect.get(target, prop, receiver);
        }
    },
    set(target, prop, value, receiver) {
        console.log('set', target[prop], value);
        return Reflect.set(target, prop, value, receiver);
    }
}

// vue2
function defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log(`您试图访问value值: ${value}`)
            return value
        },
        set(newVal) {
            console.log(`您试图改变value值: ${newVal}`)
            value = newVal
        }
    })
}
        
function observe(data) {
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key])
    })
}
 

// vue3



let arr = ["apple", "banana"]
observe(arr)
arr.push(12)
// arr[1] = 12


const obj = {
    name: 'denny',
    school: [0, 1, 2],
    classes: {
        name: [1, 2]
    }
}

const proxyObj = new Proxy(obj, handle);
// proxyObj.school.push(12)
