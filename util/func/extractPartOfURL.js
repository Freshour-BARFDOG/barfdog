const extractPartOfURL = (value) => {
  const url = new URL(value);
  const host = url.host;
  const origin = url.host;
  const pathname = url.pathname;
  const protocol = url.protocol;
  return {pathname, host, origin, protocol};
};


export default extractPartOfURL;