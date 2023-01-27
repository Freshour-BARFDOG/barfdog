


export const convertSearchQueryStrings = (urlQueries) => {
  
  if ( !urlQueries ) return;
  
  const questionMark = "?";
  const queries = urlQueries.replace(questionMark, "").split("&");
 
  const updatedQueries = queries.map(q=> {
    const sprt = "=";
    const qArr = q.split(sprt);
    const key = qArr[0];
    const val = qArr[1];
    const updatedVal = processorMap(val)[key];
    const updatedQuery = `${key}${sprt}${updatedVal}`;
    return updatedVal ? updatedQuery : q;
  });
  return `${questionMark}${updatedQueries.join('&')}`;
}

const processorMap = (val) =>({
  page: pageIndexToPageNumber(val),
  someKey: null, // 추가적인 로직이 필요할 경우 추가.
})

const pageIndexToPageNumber = (pageIndex) => {
  return  Number(pageIndex) + 1;
}