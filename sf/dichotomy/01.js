// 求 target 的索引位置，如果不存在；求即将插入的目标位置
const nums1 = [1,3,5,6], target1 = 7
const nums2 = [1,3,5,6], target2 = 2
const nums3 = [1,3,5,6], target3 = 5
const nums4 = [1,3,5,6], target4 = 6

// 递归：错误❌
function getIndex1(arr, target) {
  if (!Array.isArray(arr)) return;
  if (arr.length <= 1) return 1;

  let middleIndex = Math.floor(arr.length / 2);

  if (arr[middleIndex] === target) {
    return middleIndex;
  } else if(arr[middleIndex] < target) { // right
    middleIndex += getIndex(arr.slice(middleIndex), target);
  } else if(arr[middleIndex] > target) { // left
    middleIndex -= getIndex(arr.slice(0, middleIndex), target);
  }

  return middleIndex;
}

function getIndex(arr, target) {
  let l = 0, r = arr.length - 1;

  while(l <= r) {
    let mid = Math.floor((r + l) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      r = mid - 1;
    } else if (arr[mid] < target) {
      l = mid + 1;
    }
  }

  return l;
}

console.log(getIndex(nums1, target1));
console.log(getIndex(nums2, target2));
console.log(getIndex(nums3, target3));
console.log(getIndex(nums4, target4));
