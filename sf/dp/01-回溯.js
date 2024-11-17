// 给定 N 个物品和一个容量有限为 W 的背包
// 每个物品有两种属性：v[i]（该物品的体积） 和 w[i]（该物品的价值，即权重），求解在不超过背包最大容量的情况下，能装下物品的最大价值是多少。

const w = 4;
const weight = [1, 3, 4];
const value = [15, 20, 30];


let max_value = 0;
let best_solution = [];

// i 表示当前物品的下标
// current_weight 表示当前背包的容量
// current_value 表示当前背包的价值
// solution 表示当前背包的解? 没理解 
function backtrack(i, current_weight, current_value, solution) {
  if (i === weight.length) {
    if (current_value > max_value) {
      max_value = current_value;
      best_solution = solution;
    }
    return;
  }

  // 不选择当前物品
  backtrack(i + 1, current_weight, current_value, solution);

  // 选择当前物品
  if (current_weight + weight[i] <= w) {
    solution.push(i);
    backtrack(i + 1, current_weight + weight[i], current_value + value[i], solution);
    // solution.pop();
  }
}

function solve() {
  backtrack(0, 0, 0, []);
  console.log(best_solution);
  console.log(max_value);
}

solve();