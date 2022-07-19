export const filter_HTMLStrings = (htmlStr, startStr, endStr) => {
  const filteredHTMl = htmlStr.split( startStr ).map( (html, index) => {
    if ( index > 0 ) {
      const endIndex = html.indexOf( endStr );
      return endIndex >= 0 ? html.slice( endIndex + 1 ) : html;
    } else {
      return html
    }
  } ).join( '' )
  return filteredHTMl;
}