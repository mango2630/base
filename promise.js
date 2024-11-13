let p1 = new Promise((resolve, reject) => {
    resolve();
    setTimeout(reject, 10000);
})
// console.log(p1);

let p2 = new Promise((resolve, reject) => {
    reject();
})

console.log(p2);