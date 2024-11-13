const n = 100;

// 方法一：循环 O(n)
function sum1(n) {
    let sum = 0;
    for (let i = 1; i <= n; i ++) {
        sum += i; // 执行 n 次
    }
    return sum;
}

// 方法二：数学公式、高斯求和 O(1)
function sum2(n) {
    const result = (n * (n + 1)) / 2;
    return result;
}

// 方法三：递归 sum(n) = sum(n - 1) + n ;结束条件 n === 1, 返回 1（1 + 2 + ...)
function sum3(n) {
    if (n === 1) return 1;
    return sum3(n - 1) + n;
}

console.log(sum3(n));