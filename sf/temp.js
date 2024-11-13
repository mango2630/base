// test1
let num1 = 0.1 + 0.22;
let num2 = Math.floor(num1 * 10) / 10;
let num3 = Math.floor(num1 * 100) / 100;
// console.log(num1, num2, num3);

// test2
let str1 = 'abc';
// console.log(str1[0]);

// test3
function compare1(a, b) { // 升序
    if (a < b) return -1;
    if (a > b) return 1;
    if (a === b) return 0;
}
const arr1 = [1, 2, 3, -1];
arr1.sort(compare1);
// console.log(arr);

// test4 字符串数组排序
const str2 = ['ab', 'dd', 'aga'];
function compare2(a, b) {
    if (a < b) return 1;
    if (a > b) return -1;
    if (a === b) return 0;
}
str2.sort(compare2);
console.log(str2);


// interface Fun {
//     (num1: number, str: string): string;
    
// }

// interface arr {
//     school: number[];
// }

// interface obj {
//     [name: string]: String;
//     [age: string]: (a: number) => number;
// }

function taskOne() {
    console.log('1')
    setTimeout(() => {  // 宏任务 2
      Promise.resolve().then(() => { // 微任务 2-1 x
        console.log('2')
      })
      setTimeout(() => {  // 宏任务 5 x
        console.log('3')
      }, 0)
    }, 0)
    taskTwo()
}
  
  
function taskTwo() {
    console.log('4')
    Promise.resolve().then(() => { // 微任务队列 1 x
        setTimeout(() => {  // 宏任务队列 4 x
            console.log('5')
        }, 0)
    })

    setTimeout(() => {   // 宏任务队列 3 x
        console.log('6')
    }, 0)
}

setTimeout(() => {   // 宏任务 1 x
    console.log('7')
}, 0)

taskOne()

Promise.resolve().then(() => { // 微任务队列 2 x
    console.log('8')
})

// 1 4 8 ｜ 7 2 6 3 5