const obj = {
  name: 'denny',
  school: [0, 1, 2],
  classes: {
      name: [1, 2],
      year: {
          time: 12
      }
  }
}

function createProxy(obj, keyArr = []) {
  new Proxy(obj, {
    get(target, property) {

      // 对象：递归代理
    }
  })
}

const proxyObj = createProxy(obj);

proxyObj.classes;
proxyObj.classes.year;