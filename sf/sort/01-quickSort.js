// 1. pivot 取左边时，等于号算到右边区域
// 2. 需要加下表限制

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function quickSort(arr) {
  if(!Array.isArray(arr)) return arr;
  if (arr.length <= 1) return arr;

  let l = 0, r = arr.length - 1;
  let pivot = arr[0];

  while(l < r) {
      while(arr[r] >= pivot && r > 0) r --;
      while(arr[l] < pivot && l < arr.length) l ++;

      if (l < r) {
        let temp = arr[r];
        arr[r] = arr[l];
        arr[l] = temp;
      }
  }
  return [...quickSort(arr.slice(0, r + 1)), ...quickSort(arr.slice(r + 1))]
}

function quickSort2(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0], pivotIndex = 0;
  let storeIndex = pivotIndex + 1;
  
  for(let i = 1; i < arr.length; i ++) {
    if (arr[i] < pivot) {
      swap(arr, i, storeIndex);
      storeIndex ++;
    }
  }

  swap(arr, pivotIndex, storeIndex - 1);

  return [...quickSort(arr.slice(0, storeIndex - 1)), ...quickSort(arr.slice(storeIndex - 1))];
}

function quickSort3(arr) {
  if (!Array.isArray(arr)) return arr;
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = [], right = [];

  for(let i = 1; i < arr.length; i ++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
const arr = [3,2,1,5,6,4];
console.log(quickSort(arr));