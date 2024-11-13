/**
 * 递归：自己调用自己
 * 解决：
 * 1. 思考最简单的输入是什么，对应的输出是什么。
 * 2. 尝试一些例子，找出输入、输出的互动关系。
 * 3. 多找和当前输入相关的几组来找规律，如例子2
 */

/**
 * 例子1: 求和
 * eg: sum(5) = 1 + 2 + 3 + 4 + 5
 * 简单：1 = > 1
 * 复杂：sum(2) = sum(1) + 1 => sum(n) = sum(n - 1) + n
 */
function sum(num) {
    if (num === 1) return 1;
    return sum(num - 1) + num;
}
// console.log(sum(3));

/**
 * 例子2: n * m 网格中，左上角到右下角的路径数
 * 这个需要多画图尝试规律
 * n * m = (n-1)*m + n*(m-1)
 */
function pathNum(n, m) {
    if (n === 1) return 1;
    if (m === 1) return 1;
    return pathNum(n - 1, m) + pathNum(n, m - 1);
}
console.log(pathNum(2, 3));

