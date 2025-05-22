function createProxy(target, path = []) {
    const handler = {
      get(target, prop, receiver) {
          const newPath = path.concat(prop);
          console.log('访问路径:', path, '---', newPath.join('.'));
          const value = Reflect.get(target, prop, receiver);
          if (typeof value === 'object' && value !== null) {
              return createProxy(value, newPath);
          }
          return value;
      }
    }
    return new Proxy(target, handler);
}

const obj = {
    name: 'denny',
    school: [0, 1, 2],
    classes: {
        name: [1, 2],
        year: {
            time: 12
        }
    }
};

const proxyObj1 = createProxy(obj);
console.log(proxyObj1.classes.name); // 输出: 访问路径: classes.name
// console.log(proxyObj1.name);
// console.log(proxyObj1.school);
console.log(proxyObj1.classes.name);