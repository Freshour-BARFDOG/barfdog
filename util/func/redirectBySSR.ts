interface RedirectSSRInterface {
  redirect : {
    permanent: boolean;
    destination: string;
  }
}

export const redirectBySSR = (
  url: string,
  permanent: boolean = false,
): RedirectSSRInterface => {
  return {
    redirect: {
      permanent: permanent,
      destination: url,
    },
  };
};
