import React, {useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from './sns.module.scss';
import {useSelector} from "react-redux";
import {snsProviderType} from "/store/TYPE/snsProviderType";
import Image from "next/image";
import {useModalContext} from "/store/modal-context";
import Modal_confirm from "/src/components/modal/Modal_confirm";
import Spinner from "/src/components/atoms/Spinner";
import {deleteObjData, getDataSSR} from "/src/pages/api/reqData";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";

export default function SNSManagementPage() {
  const mct = useModalContext();
  const auth = useSelector(s=>s.auth);
  const userInfo = auth.userInfo;
  const [activeModal, setActiveModal] = useState( false );
  const [isLoading, setIsLoading] = useState( {} );
  const [isSubmitted, setIsSubmitted] = useState( false);
  // console.log(userInfo);
  
  const onStartDisconnectSns = ()=>{
    setActiveModal(true);
  }
  
  const disconnectSnsHandler = async (confirm)=>{
    if(!confirm){
      return setActiveModal(false);
    } else if(isSubmitted) {
      return mct.alertShow('이미 제출된 양식입니다.');
    }
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const url = `/api/members/sns`;
      const res = await deleteObjData(url);
      console.log(res);
      if(res.isDone){
        mct.alertShow('SNS연동이 해제되었습니다.');
        setIsSubmitted(true)
      }else{
        mct.alertShow('통신장애로 인해 SNS연동에 실패하였습니다.')
      }
      setActiveModal(false);
      
    } catch (err) {
      mct.alertShow('통신장애\n',err.response)
      console.error(err)
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
    
  }
  
  const onSuccessCallback = () => {
    window.location.reload();
  }
  
  return (
    <>
      <MetaTitle title="마이페이지 SNS연동"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
                <div>
                  연동SNS
                </div>
            </section>
            <section className={s.content}>
              <div className={s.gray_box}>

                <div className={s.row_1}>
                  연동된 SNS
                </div>
                <div className={s.row_2}>
                  {!userInfo.provider && <span>현재 연결된 SNS가 없습니다.</span>}
                  {snsProviderType.KOR[userInfo.provider]}
                  {userInfo.provider === snsProviderType.KAKAO && (
                    <figure className={`${s.image} img-wrap`}>
                      <Image
                        src={require('/public/img/icon/kakao.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카카오톡 아이콘"
                      />
                    </figure>
                  )}
                  {userInfo.provider === snsProviderType.NAVER && (
                    <figure className={`${s.image} img-wrap`}>
                      <Image
                        src={require('/public/img/icon/naver.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카카오톡 아이콘"
                      />
                    </figure>
                  )}
                </div>
              </div>
            </section>
            
            <section className={s.btn}>
              <div className={s.btn_box}>
                <button className={`${s.red_btn } ${!userInfo.provider ? 'disabled' : ''}`} disabled={!userInfo.provider} onClick={onStartDisconnectSns}>
                  {isLoading.submit ? <Spinner style={{color:'#fff'}} /> : '연동 해제하기'}
                </button>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeModal && (
        <Modal_confirm
          text={`SNS(${snsProviderType.KOR[userInfo.provider]})연동을 해지하시겠습니까?`}
          isConfirm={disconnectSnsHandler}
          positionCenter
        />
      )}
      <Modal_global_alert onClick={isSubmitted && onSuccessCallback}/>
    </>
  );
}





export async function getServerSideProps ({req}) {
  const url = '/api/members/sns/password'; // api이름: 비밀번호 설정해야하는 유저인지 확인
  const res = await getDataSSR(req, url);
  if(res.data){
    const needToSetPassword = res.data.needToSetPassword;
    if(needToSetPassword){
      return {
        redirect:{
          destination:'/mypage/user/setPassword',
          permanent: false,
        },
        props: {}
      }
    }
  }
  
  return {
    props: {}
  }
  
}