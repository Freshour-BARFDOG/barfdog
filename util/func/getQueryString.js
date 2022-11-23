export const getQueryString = (queryObj) => {
  let queryString = '';
  let arr = [];
  for (const key in queryObj) {
    const val = queryObj[key];
    arr.push( `${key}=${val}` );
  }
  queryString = arr.join( '&' );
  return queryString;
};