function all(promises) {
    // 判断 promises 是否为可迭代对象
    if (!promises[Symbol.iterator]) throw Error('');
    let result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        for (const promise of promises) {
            promise.then((res) => {
                result.push(res);
                count ++;
                if (count === promises.length) {
                    resolve(result);
                }
            }).catch((error) => {
                reject(error);
            })
        }
    })
}

function race(promises) {
    // 判断 promises 是否为可迭代对象
    if (!promises[Symbol.iterator]) throw Error('');
    let result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        for (const promise of promises) {
            promise.then((res) => {
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        }
    })
}

// instanceof
function resolve(value) {
    return new Promise((resolve, reject) => {
        // value 为非 promise
        if (value instanceof Promise) {
            // value 为 promise
            value.then(res => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        } else {
            resolve(value);
        }
        
    })
}

console.log(resolve(12));

const promise1 = new Promise((resolve, reject) => {
    resolve(1);
  });
  
const promise2 = new Promise((resolve, reject) => {
    resolve(2);
});

// all([promise1, promise2]).then(res => console.log(res))