const price = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 28]; // price[i] = value: i 米长的绳子对应的价格是多少
const n = 15; // 总长为15米的绳子怎么切割，可以卖出最大价格


// 求可以卖出的最大价格
function dp(price, n) {

  let arr = new Array(n + 1).fill(0); // 存储 i 米绳子对应的能获取到的最大价值

  for (let i = 1; i <= n; i ++) {
    for (let j = 1; j <= i; j ++) { // 求 i 米绳子怎么切割，才能获得最大价值

      if ( i >= price[j]) {
        arr[i] = Math.max(arr[i], price[j] + arr[i - j]);      
      }
    }
    
  }

  console.log(arr)
  return arr[n];
}

console.log(dp(price, n));
