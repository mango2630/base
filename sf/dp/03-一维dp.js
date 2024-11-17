const w = 4;
const weight = [1, 3, 4];
const value = [15, 20, 30];

// 二维：dp[i][j] = Max(dp[i-1][j], dp[i-1][j-weight[i]] + value[i])
// 一维：dp[j] = Max(dp[j], dp[j - weight[i]] + value[i]) 

function maxValue() {
  const dp = new Array(w + 1).fill(0);

  for (let i = 0; i < weight.length; i ++) { // 遍历物品
    for (let j = w; j >= weight[i]; j --) {  // 遍历背包容量
      dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
  }

  return dp[w];
}

console.log(maxValue());