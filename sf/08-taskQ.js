// JS 事件循环
let a = () => {
    setTimeout(() => {
        console.log(1);
    }, 0)
    console.log(11);
}
let b = () => {
    setTimeout(() => {
        console.log(2);
    }, 0)
    console.log(22);
}
let c = () => {
    setTimeout(() => {
        console.log(3);
    }, 0)
    console.log(33);
}
// a()
// b()
// c()

function executor(resolve, reject) {
    let rand = Math.random();
    // let rand = 12;
    console.log(1)
    console.log(rand)
    if (rand > 0.5)
        resolve()
    else
        reject()
}
var p0 = new Promise(executor);

var p1 = p0.then((value) => {
    console.log("succeed-1")
    return new Promise(executor)
})


var p3 = p1.then((value) => {
    console.log("succeed-2")
    return new Promise(executor)
})

var p4 = p3.then((value) => {
    console.log("succeed-3")
    return new Promise(executor)
})


p4.catch((error) => {
    console.log("error")
})
console.log(2)