

export default function sorting(arr, key, dir = 'ascend') {
  // 내림차순 : b - a ( Ex. 3,2,1)
  // 오름차순 : a - b ( Ex. 1,2,3)
  const newArr = arr.sort((a, b) => {
    let sort;
    if (dir === "descend") {
      sort = b[key] - a[key];
    } else {
      sort = a[key] - b[key];
    }
    return sort;
  });

  return newArr;
}
