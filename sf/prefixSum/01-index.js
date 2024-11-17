const arr = [1, 2, 3, 4, 5];

const prefixSum = [arr[0]];
for (let i = 1; i < arr.length; i++) {
  prefixSum[i] = prefixSum[i - 1] + arr[i];
}

// [1, 2,] 区间和
const sum1 = prefixSum[2] - prefixSum[0];

console.log(sum1);
