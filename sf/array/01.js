let arr = [1, 3, 5, 2];

// ================【插入、删除】==================
// 插入元素 -- 数组末尾
arr[arr.length] = 4;
arr.push(6);

// 插入元素 -- 数组开头
arr.unshift(0);

// 删除元素 -- 数组末尾
arr.pop();   // push pop 模拟栈

// 删除元素 -- 数组开头
arr.shift(); // unshift shift 模拟队列

// 插入、删除元素 -- 指定位置
// 1. splice(start, deleteCount, item1, item2, /* …, */ itemN)
arr.splice(2, 1); // 从下标为2的元素开始删除1个元素
arr.splice(2, 0, 9); // 从下标为2的元素开始，删除0个元素，插入9

// ================【其它】==================
// 数组合并
// 1. concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。浅拷贝
// concat(value0, value1, /* … ,*/ valueN)
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2, 'aaa');
// 2. 展开运算符
const array4 = [...array1, ...array2, 'aaa'];

// 迭代器函数
// 1. every() 方法用于检测数组所有元素是否都通过了指定函数的测试。它返回一个布尔值。
const isBelowThreshold = (currentValue) => currentValue < 40;
const array5 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(isBelowThreshold));
// 2. some() 方法用于检测数组中的元素是否满足指定条件。它返回一个布尔值。
// 3. forEach() 方法对数组的每个元素执行一次回调函数。
// 4. map() 方法返回一个新数组，数组中的元素为原始数组元素调用回调函数处理后的值。
// 5. filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
// 6. reduce() 方法接收一个函数作为累加器 accumulator，数组中的每个值从左到右开始缩减，最终计算为单个值。返回一个新数组
//    - initialValue 如果没有指定，callbackFn 从数组中的第二个值作为 currentValue 开始执行

// 数组去重
// 1. 使用 Set 对象
const array6 = [...new Set(array1)];
// 2. 使用 filter 方法
const array7 = array1.filter((item, index, array) => {
    return array.indexOf(item) === index;
});
// 3. 使用 reduce 方法
const array8 = array1.reduce((pre, cur) => {
    if (pre.indexOf(cur) === -1) {
        pre.push(cur);
    }
    return pre;
}, []);


// ================【ES6 数组新功能】==================

// ================【数组排序】==================
// 1. reverse toReversed
arr.reverse(); // 改变原数组
// 2. sort 将元素默认为字符串进行相互比较，参考 AscII 码 (1-9 A-Z a-z)
// - 传入自己的比较函数，这样参数就是数字来做比较
arr.sort((a, b) => a - b);

// 3. 字符串排序
// - AscII 码 (1-9 A-Z a-z)
// - localeCompare() 方法返回一个数字，表示参考字符串在排序顺序中是在给定字符串之前、之后还是与之相同。
const array9 = ['Anna', 'anna', 'cob', 'Job', 'bob'];
// array9.sort(); // ['Anna', 'Job', 'bob', 'anna', 'cob'] 大写字母在小写之前
// array9.sort((a, b) => a - b); // [ 'Anna', 'anna', 'bob', 'cob', 'Job' ]
array9.sort((a, b) => {  // [ 'Anna', 'anna', 'bob', 'cob', 'Job' ]
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
})
// array9.sort((a, b) => a.localeCompare(b)); // ['anna', 'Anna', 'bob', 'cob', 'Job' ]

// ================【数组搜索】==================
const array10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. indexOf() 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回 -1。
// 2. lastIndexOf() 方法返回指定元素��也即有效的 JavaScript 值或变量��在数组中的最后一个的索引，如果不存在，则返回 -1。从数组的末尾向前查找。
// 3. ES6 find(callBack) 返回第一个满足条件的值
const fn1 = (item) => item%3 === 0;
array10.find(fn1); // 3
// 4. ES6 findIndex() 返回第一个满足条件的值的下标
array10.findIndex(fn1); // 2
// 5. ES7 includes(ele) 返回一个布尔值来表示是否存在
array10.includes(3); // true

// ===============【数组转换】==================
// 1. 数组转字符串 join()
var arr = [1, 2, 3, 4, 5];
arr.join('-'); // '1-2-3-4-5'
arr.join(''); // '12345'
arr.join(' '); // '1 2 3 4 5'

// 2. 字符串转数组 split()
var str = '1-2-3-4-5';
str.split('-'); // ['1', '2', '3', '4', '5']
str.split(''); // ['1', '-', '2', '-', '3', '-', '4', '-', '5']
str.split('', 2); // ['1', '-']

// 3. toString()
arr.toString(); // '1,2,3,4,5'

console.log(res);