// 返回一个新的数组
// 默认是一层, Infinity

Array.prototype.flat = function(depth = 1) {
    // 参数类型 & Infinity
    let resultArr = [];
    let arr = this;

    for (let i = 0; i < depth; i ++) {
        resultArr = [];
        for (const ele of arr) {
            if (Array.isArray(ele)) {
                resultArr = [...resultArr, ...ele];
            } else {
                resultArr.push(ele);
            }
        }
        arr = resultArr;
    }

    return resultArr;
}

function flat1(arr, depth = 1) {
    let flatArr = [];
    for (let i = 0; i < depth; i ++) {
        flatArr = [];
        for (const ele of arr) {
            if (Array.isArray(ele)) {
                flatArr = [...flatArr, ...ele];
            } else {
                flatArr.push(ele);
            }
        }
        arr = flatArr; // 问题：修改了原数组
    }
    return flatArr;
}

function flat2(input) {
    // console.log(input.toString().split(','));
    return input.toString().split(',').map(item => Number(item));
}

function flat3(arr, depth = 1) {
    return arr.reduce((acc, val) => {
        if (Array.isArray(val) && depth > 1) {
        return acc.concat(myFlat(val, depth - 1));
        } else {
        return acc.concat(val);
        }
    }, []);
}

// 示例用法
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
const flattened = arr.flat(5);
console.log(flattened);