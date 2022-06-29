import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import MetaTitle from "/src/components/atoms/MetaTitle";



function AdminIndex() {
  const router = useRouter();
  const auth = useSelector(state=>state.auth);
  const isAuth = auth.token ? true : false;
  useEffect(() => {
    // console.log(auth);
    if (isAuth) {
      router.push('/bf-admin/dashboard');
    }
  }, [isAuth]);
  

  return (
    <>
      <MetaTitle title="관리자 Index" admin={true} />
    </>
  );
}

export default AdminIndex;