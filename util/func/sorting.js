

export default function sorting(arr, key, dir) {
  // 내림차순 : b - a ( Ex. 3,2,1)
  // 오름차순 : a - b ( Ex. 1,2,3)
  const newArr = arr.sort((a, b) => {
    let sort = a[key] - b[key];

    if (dir === "descend") {
      sort = b[key] - a[key];
    }
    return sort;
  });

  return newArr;
}
