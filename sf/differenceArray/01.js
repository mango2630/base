const arr = [1, 2, 3, 4, 5];

// 构建差分数组
const diff = [arr[0]];
for (let i = 1; i < arr.length; i++) {
  diff[i] = arr[i] - arr[i - 1];
}

// [0, 2] +3
diff[0] += 3;
diff[3] -= 3;

// [3, 4] -1
diff[3] -= 1;

// 还原数组
arr[0] = diff[0];
for (let i = 1; i < diff.length; i++) {
  arr[i] = arr[i - 1] + diff[i];
}

console.log(arr);

