function quickSort(arr) {
  if (!Array.isArray(arr)) return arr;
  if (arr.length <= 1) return arr;

  let l = 0, r = arr.length - 1;
  const pivot = arr[0];

  while(l < r) {
    while(arr[r] >= pivot && r > 0) r --;
    while(arr[l] < pivot && l < arr.length) l ++;

    if (l < r) {
      let temp = arr[r];
      arr[r] = arr[l];
      arr[l] = temp;
    }
  }

  return [
    ...quickSort(arr.slice(0, r + 1)),
    ...quickSort(arr.slice(r + 1))
  ];
}

const arr = [3,2,1,5,6,4];
console.log(quickSort(arr));
