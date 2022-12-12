export const getAllItemIdList = (items, query = 'id') => {
  let ids = [];
  items.map( (item) => {
    for (const itemKey in item) {
      const val = item[itemKey];
      if ( itemKey === query ) {
        ids.push( val );
      }
      if ( Array.isArray( val ) && val.length ) {
        const arr = val;
        for (const obj of arr) {
          const id = obj[query]
          ids.push( id );
        }
      }
    }
  } );
  return ids;
}