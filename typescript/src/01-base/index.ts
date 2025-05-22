function add(x: number, y: number): number {
  return x + y;
}

// @ts-expect-error
add(1, '2');