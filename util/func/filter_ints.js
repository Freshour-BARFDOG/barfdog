const filter_ints = (numString, intCount) => {
  const val = numString;
  let digits = typeof intCount !== 'number' ? Number( intCount ) : intCount;
  const int = val.split( '.' )[0];
  if ( !int ) {
    return numString;
  }
  const demical = val.split( '.' )[1];
  if ( !demical ) {
    return numString;
  }
  const convertedInt = int.substring( 0, digits );
  // console.log(`${convertedInt}.${demical}`);
  return `${convertedInt}.${demical}`;
};

export default filter_ints;