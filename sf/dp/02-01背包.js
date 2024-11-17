const w = 4;
const weight = [1, 3, 4];
const value = [15, 20, 30];

// dp[i][j] = Max(dp[i-1][j], dp[i-1][j-weight[i]] + value[i])

function maxValue() {
  // 错误的创建二维数组的方法
  // const dp = new Array(weight.length).fill(new Array(w + 1).fill(0))

  // 创建二位数组
  const dp = new Array(weight.length);
  for (let i = 0; i < dp.length; i ++) {
    dp[i] = new Array(w + 1).fill(0);
  }


  // 处理 i = 0 的情况
  for (let j = w; j >= weight[0]; j --) {
    dp[0][j] = dp[0][j - weight[0]] + value[0];
  }

  // dp
  for (let i = 1; i < weight.length; i++) {
    for (let j = 1; j <= w; j++) {
      if (j < weight[i]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }
  console.log(dp);
  return dp[weight.length - 1][w];
}

console.log(maxValue());
