export const filter_blindingUserName = (name) => {
  let blindingUserName;
  if ( !name ) return;
  if ( typeof name !== 'string' ) return console.error( 'Required String Value' );
  const letters = name.split( '' );
  const lastIndex = letters.length - 1;
  
  
  if ( letters.length === 2 ) {
    letters.splice( 1, 1, '*' ).join( '' );
    
  } else if ( letters.length > 2 ) {
    blindingUserName = letters.map( (letter, index) => (index >= 1 && index !== lastIndex) ? '*' : letter ).join( '' );
  }
  return blindingUserName;
}