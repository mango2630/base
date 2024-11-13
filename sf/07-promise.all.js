/**
 * 1. 一个 pending => pending
 * 2. 有一个 reject => reject, reason 为第一个 reject 的 reason；其它 reject 静默处理
 * 3. 全部都 resolve, 才会 resolve。
 */

/**
 * Promise.resolve()
 * Promise.all()
 */

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const result = [];
        let count = 0; // 考虑到是否按照顺序循环

        promises.forEach( (promise, index) => {
            Promise.resolve(promise)
            .then(res => {
                result[index] = res;
                count ++;
                if (count === promises.length) {
                    resolve(result);
                }
            })
            .catch(error => {
                reject(error);
            })
        });
    })
}

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

promiseAll([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // 输出: [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });