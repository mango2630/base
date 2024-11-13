
const target = {
    name: 'denny',
};

// console.log(Reflect.getOwnPropertyDescriptor(target, 'nickname'));

// console.log(target.nickname);

const proxy = new Proxy(target, {
    get(target, property, receiver) {
        // console.log(target, property, receiver);
        return Reflect.get(...arguments)
    },
    ownKeys(target) {
        return Reflect.ownKeys(target);
    }
})

proxy.age = 12;

Reflect.defineProperty(proxy, 'sex', {
    configurable: false,
})

console.log(Reflect.get(target, 'name', proxy));