import extractPartOfURL from "./extractPartOfURL";

export const decodeUrlToMatchApiProtocolAndSearchQuery = (url) => {
  const origin = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL_PRODUCT : process.env.NEXT_PUBLIC_API_URL_DEV;
  const {pathname, search} = extractPartOfURL( url );
  return `${origin}${pathname}${search}`;
};
