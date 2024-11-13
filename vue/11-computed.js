const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

function effect(fn, options = {}) { // 注册副作用函数
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // console.error('effect', fn);
    const res = fn(); // 调用时会触发 track
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  }
  effectFn.options = options
  effectFn.deps = [];  // 存储所有与该辅佐函数相关联的依赖集合
  if (!options.lazy) {
    effectFn();          // 执行副作用函数
  }
  return effectFn
}
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i ++) {
    const dep1 = effectFn.deps[i];
    dep1.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

function track(target, key) {
  if (!activeEffect) return target[key];
  let depsMap = effectBucket.get(target);;
  if (!depsMap) {
    effectBucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect); // deps 表示与副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key); // oo,这个 key 对应的 set 可能会不存在；因为只有这个 obj 被 track 过，key 并未 track
  const depsTo = new Set();
  deps && deps.forEach(fn => {  // 为什么需要判断 deps 是否存在
    if (fn !== activeEffect) {  // 避免无限递归
      depsTo.add(fn);
    }
  })
  depsTo && depsTo.forEach(fn => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}

const data = {
  age: 12
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key);
    return true;
  }
})

const jobQueue = new Set();
let isFlushing = false;
const p = Promise.resolve()

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  })
}

// 等计算属性的返回值使用到的时候再执行
// computed 返回值是一个对象，该对象的 value 属性是一个访问器属性
function computed(getter) {
  let value; // value 用来缓存上一次计算的值
  let dirty = true; // 标识是是否需要重新计算值
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: (fn) => {
      if (!dirty) {
        dirty = true; // dirty 为 true 时，会在 computed 的 get 中执行副作用函数
        trigger(obj, 'value'); // 当计算属性依赖的对象值变化时，手动 trigger
      }
    }
  })
  // 计算属性的懒执行指什么：
  // 1. 只有当计算属性值用到的时候，才开始 effectFn
  // 2. 
  const obj1 = {
    get value() {
      console.log(obj);
      track(obj, 'value'); // why: 为什么是代理对象 obj(proxy)-value
      if (dirty) { // 只有脏时才计算值，并将得到的值缓存到 value 中
        value = effectFn(); // 懒执行，只有当读取的时候，才会执行 effectFn
        dirty = false;
      }
      // 当读取 value 时，手动调用 track 函数进行追踪
      // track(obj1, 'value');
      return value
    }
  }
  return obj1;
}

// 当 obj.age 值发生变化时，dirty 置为 true ==> scheduler

const res = computed(function fn1 () {
  console.log('fn1');
  return obj.age + 1
});
// console.log('computed', res.value);
// obj.age ++;
// console.log('computed', res.value);
// obj.age ++;
// console.log('computed', res.value);
// console.log('computed', res.value);

// obj.age ++; 
const newE = effect(function fn2 () {
  console.log('new effect', res.value);
})

obj.age ++; // 修改值时，因为上面的 res.value 在读取值（副作用函数），所以应该会执行 fn2 这个副作用函数
obj.age ++;