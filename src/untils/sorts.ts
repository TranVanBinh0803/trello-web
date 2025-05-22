export const mapOrder = <T, K extends keyof T>(
  originalArray: T[] | undefined | null,
  orderArray: T[K][] | undefined | null,
  key: K | undefined | null
): T[] => {
  if (!originalArray || !orderArray || !key) return [];

  const clonedArray = [...originalArray];
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]);
  });

  return orderedArray;
};