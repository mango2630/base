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

function createProxy(obj, propertyArr = []) {
    if (typeof obj !== 'object') return ;
    const handle = {
        get(target, property, receiver) {
            propertyArr.push(property);
            console.log(propertyArr.join('.'));
            if (typeof target[property] === 'object') {
                return createProxy(target[property], propertyArr);
            } else {
                return Reflect.get(target, property, receiver);
            }
        },
    }
    return new Proxy(obj, handle);
}

const proxyObj = createProxy(obj);

proxyObj.classes;
proxyObj.classes.year;