export const filter_apiHostname = (apiUrl) => {
  const apiHostName = process.env.NEXT_PUBLIC_API_URL_PRODUCT;
  const apiPath = apiUrl?.split( apiHostName )[1];
  return apiPath;
}