function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];

  for (const element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

const arr = [5, 2, 9, 1, 7, 6, 3];
console.log(quickSort(arr));