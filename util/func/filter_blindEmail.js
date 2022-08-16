export const filter_blindEmail = (email, startIndex = 2) => {
  if ( email.indexOf( '@' ) < 0 ) return console.error( 'Invalid Email form' );
  let id = email.split( '@' )[0];
  let emailDomain = email.split( '@' )[1];
  const blindedId = replaceFrom( id, startIndex );
  return `${blindedId}@${emailDomain}`;
}


const replaceFrom = (str, index) => {
  if ( str.length < index ) return str;
  const chars = str.split( '' );
  return chars.map( (str, i) => (i >= index) ? '*' : str ).join( '' );
}