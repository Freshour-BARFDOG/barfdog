import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Alert, Spin, message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../api/reqData';

const inputNames = [
  "아임포트사 주문번호",
  "주문번호",
  "주문상태",
  "주문가격",
  "배송비",
  "할인 총 합계",
  "적립금 할인",
  "쿠폰 할인",
  "등급 할인",
  "초과할인금",
  "최종 결제 가격",
  "결제 방법",
  "결제 시간",
  "주문 컨펌 날짜",
  "묶음배송여부",
  "브로슈어 여부",
  "연령정책 동의 여부",
  "해당 구독 주문의 구독 횟수",
  "취소 사유",
  "취소 상세 사유",
  "취소 요청 날짜",
  "취소 컨펌 날짜",
  "구매확정시 받을 적립금",
  "구매확정시 적립금 지급 여부",
  "구독 플랜",
  "레시피 이름",
  "한 끼당 그램",
  "고객 고유 번호 (정기구독 카드 조회 용도)",
];

const dataNames = [
  "impUid",
  "merchantUid",
  "orderStatus",
  "orderPrice",
  "deliveryPrice",
  "discountTotal",
  "discountReward",
  "discountCoupon",
  "discountGrade",
  "overDiscount",
  "paymentPrice",
  "paymentMethod",
  "paymentDate",
  "orderConfirmDate",
  "package",
  "brochure",
  "agreePrivacy",
  "subscribeCount",
  "cancelReason",
  "cancelDetailReason",
  "cancelRequestDate",
  "cancelConfirmDate",
  "saveReward",
  "savedReward",
  "plan",
  "recipeName",
  "oneMealGramsPerRecipe",
  "customerUid",
]

const dataIsDisabled = [
  true,
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
  true,
  true,
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
  true,
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

    // let link = `http://localhost:8080/api/admin/new/orders/subscribeOrderGet/${id}`;
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
        const url = `api/admin/new/orders/subscribeOrderGet/${id}`;
        const res = await getData(url);

        if(res.status === 200){
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

    console.log(dataBase)
    
    let data = dataBase;

    // let link = `http://localhost:8080/api/admin/new/orders/subscribeOrderPost/${id}`;


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
          const url = `api/admin/new/orders/subscribeOrderPost/${id}`;
          const res = await postData(url, data);
  
          if(res.status === 200){
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

  console.log(dataBase);



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
      <h1>구독 주문(SubscribeOrder) 상세 페이지</h1>
      <p>DB SubscribeOrder ID: {id}</p>

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