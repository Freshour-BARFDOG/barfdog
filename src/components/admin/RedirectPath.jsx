import React from 'react'
import { useRouter } from "next/router";


function RedirectPath({redirPath}) {
  const router = useRouter();
  const curPath = router.pathname;
  // const [curPath, setCurPath] = useState();
  if (curPath === redirPath) return redirPath;
}

export default RedirectPath;