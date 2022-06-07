import { useEffect } from 'react'
import * as gtag from "./gtag";


import { useRouter } from 'next/router'


function GAProvider({children}) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
      console.log(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);


  return (
    <>
      {children}
    </>
  )
}


export default GAProvider;