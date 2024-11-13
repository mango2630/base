function show() {
  console.log('denny');
}

const p = new Proxy(show, {
  apply(target, thisArg, argArray) {
    target.call(thisArg, ...argArray);
  }
})

p();

const obj = {
  trueAge: 12,

  get age() {
    console.log('this', this); // this 指向为 obj，而不是代理对象
    return this.trueAge;
  }
}

const op = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('get', receiver, target);
    // receiver 和 target 有什么区别
    return Reflect.get(target, key, receiver)
    // return target[key]
  }
})
console.log(op.age);

// console.log(obj.age);
// console.log(Reflect.get(obj, 'age', { trueAge: 22 } ));