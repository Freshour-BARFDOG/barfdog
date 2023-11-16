import React, {useEffect} from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {postObjData} from '/src/pages/api/reqData';
import {useRouter} from 'next/router';
import {FullScreenRunningDog} from "../../../components/atoms/FullScreenLoading";
import {useModalContext} from "../../../../store/modal-context";
import Modal_global_alert from "../../../components/modal/Modal_global_alert";


export default function MypageCardPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;

  const router = useRouter();
  const {imp_success, params, error_msg} = router.query;
  const [orderIdx, customUid, paymentMethod] = params;

  useEffect(() => {
    (async function changeCardData() {
      if (imp_success == 'true') {
        const apiUrl = `/api/cards/subscribes/${orderIdx}`;
        const r = await postObjData(apiUrl, {
          customerUid: customUid,
          paymentMethod: paymentMethod
        });
        // console.log(r);
        if (r.isDone) {
          mct.alertShow('카드변경 성공', onSuccessCallback);
        } else {
          mct.alertShow(`카드변경 실패\n데이터 처리 중 오류가 발생하였습니다.\n사이트 관리자에게 문의해주세요.\nerror_msg: ${r.error}`, onSuccessCallback);
        }
      } else if (imp_success == 'false') {
        mct.alertShow(`카드변경 실패 \nerror_msg: ${error_msg}`, onFailCallback);
      }

    })();

  }, []);


  const onSuccessCallback = () => {
    window.location = '/mypage/card';
  };

  const onFailCallback = () => {
    window.location = '/mypage/card';
  };


  return (
    <>
      <MetaTitle title="마이페이지 카드관리 > 카드변경 결과 (Mobile)"/>
      <Layout>
        {hasAlert ? <Modal_global_alert background={true}/> : <FullScreenRunningDog opacity={0.5}/>}
      </Layout>

    </>
  );
}
