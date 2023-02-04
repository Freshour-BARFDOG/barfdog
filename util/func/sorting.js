

export default function sorting(arr, key, dir = 'ascend') {
  // 내림차순 : b - a ( Ex. 3,2,1)
  // 오름차순 : a - b ( Ex. 1,2,3)
  if(!arr || arr?.length === 0) return console.error('sorting.js\nERROR: Required Array')
  const newArr = arr?.sort((a, b) => {
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
export const sortByDate = (arr, dir = "asc") => {
  if ( !Array.isArray( arr ) ) return null;
  
  return arr.sort( (a, b) => {
    return dir === 'asc'
      ? new Date( a ) - new Date( b )
      : dir === 'desc'
        ? new Date( b ) - new Date( a )
        : arr;
  } );
};
