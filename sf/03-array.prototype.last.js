// 题目：https://leetcode.cn/problems/array-prototype-last/description/

// slice
// 第一个参数会被转换为整数。当参数无法转换为有效的整数时，会被视为 0。 undefined/NaN -> 0
// 第二个参数传入 NaN 时，它会被视为数组的长度， undefined -> length; NaN -> 0

const arr = [2, null, 5, 9];
console.log(arr.slice('a', NaN));
console.log(arr.splice('a', NaN, 12), arr);

// splice 返回被删除的元素
// start: 被省略的话，不会做任何修改； undefined -> 0   NaN -> 0
// deleteCount: undefined -> 0; NaN->0

// console.log(arr.slice(0, '1')); // [] 字符按照0处理
// console.log(arr.slice(1, undefined)); // 返回修改后的数组 
// const arr = null;

// Number() 非数字类型字符串都转换为NaN
// '12' - 12
Number('122ae') // NaN
Number(null) // 0
Number(true) // 1 false 0
Number(undefined) // NaN


arr[arr.length - 1];

// console.log(arr.slice(arr.length - 1)[0]); // slice 返回的是一个新数组

// splice: 拼接 => 包含了删除元素的数组
// console.log(arr.splice(arr.length - 1)[0]);


// console.log(arr.pop());

let res = arr.reduce((accumulate, currentValue, currentIndex) => {
    if (currentIndex === arr.length - 1) {
        return currentValue;
    } else {
        return 0;
    }
}, 0);

// console.log(res);

Array.prototype.last = function() {
    if (!Array.isArray(this)) return -1;
    if (Array.isArray(this) && this.length < 1) return -1;
    return this.slice(this.length - 1).pop();
}

// console.log(arr.last());