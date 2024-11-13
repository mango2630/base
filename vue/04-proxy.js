const effectBucket = new WeakMap(); // 存储副作用函数

// 原始数据
const data = {
  text: 'hell world',
  show: true
}

let activeEffect;     // 全局变量 存储被注册的副作用函数
function effect(fn) { // 注册副作用函数
  activeEffect = fn;
  fn();
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
}

function trigger(target, key) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  deps && deps.forEach(fn => fn());
}

const obj = new Proxy(data, {
  get(target, key) {
    console.log('get', key);
    track(target, key);
    return target[key];
    
  },
  set(target, key, value) {
   
    target[key] = value;
    console.log('set', key, value);
    trigger(target, key);
    return true;
  }
})

effect(() => { 
  // document.body.innerText = obj.text;
  console.log('effect');
  document.body.innerText = obj.show ;
})

setTimeout(() => {
  obj.show = false;
}, 1000)
