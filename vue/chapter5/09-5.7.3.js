const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

const TriggerType = {
  SET: "SET",
  ADD: "ADD",
  DELETE: 'DELETE'
}

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
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}
function trigger(target, key, type, newVal) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const iterateEffects = depsMap.get('ITERATE_KEY');
  const deps = depsMap.get(key);
  const effectToRun = new Set();

  // 处理元素新增时，length 属性变化的响应式
  if (type === TriggerType.ADD && Array.isArray(target)) {
    // 取出与 length 相关联的副作用函数
    const lengthEffects = depsMap.get('length');
    // 将这些副作用函数添加到 effectsToRun 中
    lengthEffects && lengthEffects.forEach(lengthEffect => {
      if (lengthEffect !== activeEffect) {
        effectToRun.add(lengthEffect);
      }
    })
  }
  // 处理当 length 被修改时，被删除元素的的响应式
  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((deps, key) => {
      if (key >= newVal) { // error: Cannot convert a Symbol value to a string
        deps.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectToRun.add(effectFn);
          }
        })
      }
    })
  }
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects && iterateEffects.forEach(fn => {
      if (fn !== activeEffect) {
        effectToRun.add(fn)
      }
    })
  }
  deps && deps.forEach(fn => {
    if (fn !== activeEffect) {
      effectToRun.add(fn);
    }
  })
  effectToRun && effectToRun.forEach(fn => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}

const reactiveMap = new Map();
const originMethod = Array.prototype.includes;
// const arrayInstrumentations = {
//   includes: function(...args) {
//     // this 是代理对象，先在代理对象中查找，将结果存储到 res 中
//     let res = originMethod.apply(this, args);

//     if (res === false) {
//       // 如果在代理对象中没有找到，再通过 this.raw 从原对象查找
//       res = originMethod.apply(this.raw, args);
//     }

//     return res;
//   }
// }
const arrayInstrumentations = {};
const arrMethods = ['includes', 'indexOf', 'lastIndexOf'];

arrMethods.forEach(method => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function(...args) {
    let res = originMethod.apply(this, args);
    if (res === false || res === -1) {
      res = originMethod.apply(this.raw, args);
    }
    return res;
  }
})

function proxyObj(obj, isShallow , isReadonly) {
  const p =  new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }

      // 如果操作的目标对象是数组，并且 key 存在于 arrayInstrumentations
      // 那么返回定义在 arrayInstrumentations 上的值
      if (Array.isArray(obj) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      // 为了避免发生意外的错误，以及性能上的考虑，
      // 我们不应该在副作用函数与 Symbol.iterator 这类 symbol 值之间建立响应联系
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key);
      }


      const reflectGetRes = Reflect.get(target, key, receiver);

      if (isShallow) {
        return reflectGetRes;
      }

      if (typeof reflectGetRes === 'object' && reflectGetRes !== null) {
        return isReadonly ? readonly(reflectGetRes) : reactive(reflectGetRes);
      } 
      return reflectGetRes;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      // track(target, 'ITERATE_KEY');
      track(target, Array.isArray(target) ? 'length': 'ITERATE_KEY');
      return Reflect.ownKeys(target)
    },
    set(target, key, newVal, receiver) {
      // 只读属性
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const oldValue = target[key];
      // 处理数组修改数组长度这种情况
      const type = Array.isArray(target)
        ? Number(key) < target.length ? TriggerType.SET : TriggerType.ADD
        : Object.prototype.hasOwnProperty.call(target, key) ? TriggerType.SET : TriggerType.ADD;

      const res = Reflect.set(target, key, newVal, receiver);

      if (receiver.raw === target) {
        if (oldValue !== newVal && (oldValue === oldValue || newVal === newVal)) { // 新值与旧值相同时，不触发响应
          trigger(target, key, type, newVal);
        }
      }
      return res;
    },
    deleteProperty(target, key) {

      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }

      const hasKey = Object.prototype.hasOwnProperty.call(target, get);
      const res = Reflect.defineProperty(target, key);
      if (res && hasKey) {
        trigger(target, key, TriggerType.DELETE);
      }
    }
  })
  return p;
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  return proxyObj(obj, isShallow, isReadonly);
}

function reactive(obj) {
  const existProxy = reactiveMap.get(obj);
  if (existProxy) return existProxy;
  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
}
function shallowReactive(obj) {
  return createReactive(obj, true);
}
function readonly(obj) {
  return createReactive(obj, false, true);
}
function shallowReadonly(obj) {
  return createReactive(obj, true, true);
}
const obj = {}
let arr = reactive(['monday', 'tuesday', obj]);
effect(() => {
  // console.log(arr.includes('monday'));
})

console.log('===========');

// arr[0] = 'monday-modify'

console.log(arr.includes(obj)); // false

