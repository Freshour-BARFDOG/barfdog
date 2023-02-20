const extractPartOfURL = (value) => {
  let url = new URL(value);
  const host = url.host;
  const origin = url.host;
  const pathname = url.pathname;
  const protocol = url.protocol;
  const search = decodeURI(url.search).replaceAll(" ", "");
  return {pathname, host, origin, protocol, search};
};


export default extractPartOfURL;
