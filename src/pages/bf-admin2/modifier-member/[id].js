import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Alert, Spin, message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../api/reqData';

const inputNames = [
  "이름",
  "이메일",
  "전화번호",
  "우편번호",
  "도시",
  "거리",
  "상세주소",
  "생년월일",
  "성별",
  "서비스 이용약관",
  "개인정보 수집 및 이용",
  "SMS 수신동의",
  "이메일 수신동의",
  "만 14세 이상",
  "추천인 코드",
  "내 추천 코드",
  "등급",
  "리워드",
  "첫 결제일",
  "누적 금액",
  "누적 구독",
  "비밀번호 설정 필요",
  "다른사람 추천 유무",
  "SNS/이메일 수신동의",
  "마지막 로그인일",
  "권한",
  "가입 포털",
  "가입 포털 코드",
  "임시 비밀번호 유무",
  "구매유무",
  "브로셔",
  "탈퇴여부",
  "관리자 수정 유무",
  "구독 유무",
];

const dataNames = [
  "name",
  "email",
  "phoneNumber",
  "zipcode",
  "city",
  "street",
  "detailAddress",
  "birthday",
  "gender",
  "servicePolicy",
  "privacyPolicy",
  "receiveSms",
  "receiveEmail",
  "over14YearsOld",
  "recommendCode",
  "myRecommendationCode",
  "grade",
  "reward",
  "firstPaymentDate",
  "accumulatedAmount",
  "accumulatedSubscribe",
  "needToSetPassword",
  "recommend",
  "receiveAgree",
  "lastLoginDate",
  "roles",
  "provider",
  "providerId",
  "temporaryPassword",
  "paid",
  "brochure",
  "withdrawal",
  "fixedGrade",
  "subscribe",
]

const dataIsDisabled = [
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
]


const cancel = (e) => {
  console.log(e);
  message.error('취소되었습니다.');
};

const DetailsPage = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [dataBase, setDataBase] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event, name) => {
    const { value } = event.target;
    // dataBase를 직접 수정하지 않고, 새로운 객체를 생성하여 변경합니다.
    const newDataBase = { ...dataBase };

    // name에 해당하는 데이터 값을 변경합니다.
    newDataBase[name] = value;
    setDataBase(newDataBase);

    
  };

  const router = useRouter();
  const { id } = router.query;


  useEffect(() => {
    setIsLoading(true);

    // let link = `http://localhost:8080/api/admin/new/orders/memberGet/${id}`;
    // axios
    // .get(link)
    // .then(response => {
    //   console.log(response.data);
    //   setDataBase(response.data);
    // })
    // .catch(error => {
    //   console.error(error);
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });

    
          
    try {
      (async () => {
        const url = `api/admin/new/orders/memberGet/${id}`;
        const res = await getData(url);
        
        //console.log(res.request.status)

        if(res.request.status === 200){
          const dataToAssign = res.data ?? []; // 주어진 데이터
          setDataBase(dataToAssign); // 데이터베이스에 할당
          setIsLoading(false);
        }
      })();
    } catch (err) {
      console.error(err);
    }
    

  }, [id]);

  
  const confirm = () => {

    //console.log(dataBase)
    
    let data = dataBase;

    // let link = `http://localhost:8080/api/admin/new/orders/memberPost/${id}`;


    // axios.post(link, data)
    //   .then(response => {
    //     message.success('수정되었습니다.');
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     message.error('수정에 실패하였습니다.');
    //   });



      try {
        (async () => {
          const url = `api/admin/new/orders/memberPost/${id}`;
          const res = await postData(url, data);

          //console.log(res)
  
          if(res?.request.status === 200){
            message.success('수정되었습니다.');
          } else {
            message.error('수정에 실패하였습니다. 1');
          }
        })();
      } catch (err) {
        console.error(err);
        message.error('수정에 실패하였습니다. 2');
      }




  };

  const cancel = () => {
    message.error('취소되었습니다.');
  };

  
  if (isLoading) {
    return (
      <div>
        <Alert message="로딩 중입니다." description="잠시만 기다려주세요." type="info" showIcon />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  //console.log(dataBase);



  const showConfirmModal = () => {
    setConfirmModalVisible(true);
  };


  
  if (isLoading) {
    return (
      <div>
        <Alert message="로딩 중입니다." description="잠시만 기다려주세요." type="info" showIcon />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }


  return (
    
  <ConfigProvider
  theme={{
    token: {

      colorBgElevated: 'rgba(186, 224, 255, 1)',
      colorBorderBg: 'rgba(0, 0, 0, 1)',
      colorPrimaryBg: 'rgba(0, 0, 0, 1)',


      colorPrimaryBorder: 'rgba(0, 0, 0, 1)',
      colorTextLightSolid: 'rgba(0, 0, 0, 1)',

    },
  }}
>
    <div>
      <h1>회원(Member) 상세 페이지</h1>
      <p>DB Member ID: {id}</p>

      {inputNames.map((name, index) => (
        <Input
          key={index}
          addonBefore={name}
          defaultValue={dataBase[dataNames[index]]}
          onChange={(event) => handleInputChange(event, dataNames[index])}
          disabled={dataIsDisabled[index]}
        />
      ))}

    <Popconfirm
      title="수정"
      description="수정하시겠습니까?"
      onConfirm={confirm}
      onCancel={cancel}
      okText="네"
      cancelText="아니오"
    >
      <Button 
      onClick={showConfirmModal}>
        수정
      </Button>

      </Popconfirm>

    </div>
    
  </ConfigProvider>
  );
};

export default DetailsPage;