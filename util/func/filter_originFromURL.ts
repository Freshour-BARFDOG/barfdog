export const filter_originFromURL = (url:string):string => {
    if (!url) return;
    const CLIENT_ORIGIN = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CLIENT_URL_PRODUCT : process.env.NEXT_PUBLIC_CLIENT_URL_DEV;
    return url.replace(CLIENT_ORIGIN, "");
};
