import React, {useEffect} from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {postObjData} from '/src/pages/api/reqData';
import {useRouter} from 'next/router';
import {FullScreenRunningDog} from "../../../components/atoms/FullScreenLoading";


export default function MypageCardPage() {
  const router = useRouter();
  const { imp_success, params, error_msg } = router.query;
  const [orderIdx, customUid, paymentMethod] = params;
  
  useEffect(() => {
    (async function changeCardData() {
      if(imp_success == 'true'){
        const apiUrl = `/api/cards/subscribes/${orderIdx}`;
        const res = await postObjData(apiUrl, {
          customerUid: customUid,
          paymentMethod: paymentMethod
        });
        console.log(res);
        if(res.isDone){
          alert('카드변경 성공');
        } else {
          alert('카드변경은 성공하였으나, 서버에서 나머지 요청을 처리하는데 실패하였습니다. 관리자에게 문의해주세요.');
        }
      } else if(imp_success == 'false'){
        alert(`카드변경 실패: ${error_msg}`);
      }

      window.location = '/mypage/card';
    })();

  }, []);

  


  return (
    <>
      <MetaTitle title="마이페이지 카드관리 > 카드변경 결과 (Mobile)" />
      <Layout>
        <FullScreenRunningDog/>
      </Layout>
    </>
  );
}
