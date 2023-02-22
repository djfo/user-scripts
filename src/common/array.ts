export const zip = <A, B>(xs: A[], ys: B[]): [A, B][] => {
  const zipped: [A, B][] = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
}
