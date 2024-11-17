const bookings = [[1,2,10],[2,3,20],[2,5,25]];

const n = 5;

function corpFlightBookings(bookings, n) {
  const arr = new Array(n).fill(0);

  for (let i = 0; i < bookings.length; i ++) {
      let l = bookings[i][0] - 1;
      let r = bookings[i][1] - 1;
      let seat = bookings[i][2];

      arr[l] += seat;
      if (r + 1 < n) {
          arr[r + 1] -= seat;
      }
  }

  const originArr = [arr[0]];

  for (let i = 1; i < arr.length; i ++) {
      originArr[i] = arr[i] + originArr[i - 1];
  }

  return originArr;
};

console.log(corpFlightBookings(bookings, n));
