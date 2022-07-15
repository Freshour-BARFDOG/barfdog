const filter_demicals = (numString, demicalCount) => {
  const val = numString;
  let digits = typeof demicalCount !== 'number' ? Number( demicalCount ) : demicalCount;
  const int = val.split( '.' )[0];
  const demicalPart = val.split( '.' )[1];
  if ( !demicalPart ) {
    return numString;
  }
  
  const demical = val.split( '.' )[1].substring( 0, digits );
  // console.log(`${int}.${demical}`);
  return `${int}.${demical}`;
};

export default filter_demicals;