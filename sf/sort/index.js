const arr = [4, 5, 2, 6, 9, 1];

function bubbleSort(arr) {
  if (arr.length === 0) return;

  for(let i = 0; i < arr.length; i ++) { // 循环次数
    let isSorted = false;

    for (let j = 0; j < arr.length - i - 1; j ++) { // 比较排序
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        isSorted = true;
      }
    }

    if (!isSorted) break;
  }
}

function insertSort(arr) {
  for (let i = 1; i < arr.length; i ++) {
    let cur = arr[i];
    let j = i - 1;
    for (; j >= 0; j --) { 
      if (arr[j] > cur) { // 移动
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    arr[j + 1] = cur;
  }
}

function selectionSort(arr) {
  for (let i = 0; i < arr.length; i ++) { // 找最小元素
    let minIndex = i;
    for (let j = i; j < arr.length; j ++ ) { // 插入到已排序区的最后一个位置
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
}

function quickSort(arr) {
  quickSortRecursion(arr, 0, arr.length - 1);
}

function quickSortRecursion(arr, l, r) {
  if (l >= r) return arr;
  let 
}

function partition(arr, l, r) {
  let pivot = arr[l];
  let leftArr = [], rightArr = [];
  for (let i = l; i <= r; i ++) {
    if (arr[i] <= pivot) {
      // 方左边
      leftArr.push(arr[i]);
    } else {
      // 方右边
      rightArr.push(arr[i]);
    }
  }
  arr = [...leftArr, ...rightArr];
  return l
}

console.log(arr);
