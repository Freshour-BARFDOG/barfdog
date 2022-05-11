

export default function sorting(arr, key, dir) {
  // 내림차순 : b - a
  // 오름차순 : a - b
  const newArr = arr.sort((a, b) => {
    let sort = a[key] - b[key];

    if (dir === "descend") {
      sort = b[key] - a[key];
    }
    return sort;
  });

  return newArr;
}
