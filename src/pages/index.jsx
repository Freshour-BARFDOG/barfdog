import MetaTitle from '/src/components/atoms/MetaTitle';
import { userType } from '/store/TYPE/userAuthType';
import { getDataSSR, getTokenFromServerSide } from './api/reqData';

export default function AdminIndex() {
  return (
    <>
      <MetaTitle title="관리자 Index" admin={true} />
    </>
  );
}


export async function getServerSideProps({ req }) {
  let token = null;
  let USER_TYPE = null;

  if (req?.headers?.cookie) {
    token = getTokenFromServerSide( req );
    const getApiUrl = `/api/admin/setting`;
    const res = await getDataSSR( req, getApiUrl, token );
    if ( res && res.status === 200 ) {
      USER_TYPE = userType.ADMIN;
      
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: (USER_TYPE && USER_TYPE === userType.ADMIN) ? '/dashboard' : '/login'
    },
    props:null
  }
}
