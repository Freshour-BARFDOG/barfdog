import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Alert, Spin, message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../api/reqData';

const inputNames = [
  "다음 결제일", // nextPaymentDate
  "다음 배송일(주의! 아임포트 날짜도 같이 변경됨)", // nextDeliveryDate
  "다음 구독상품 원가", // nextPaymentPrice
  "구독회차", // subscribeCount
  "쿠폰 할인량", // discountCoupon
  "초과 할인금", // overDiscount
  "등급 할인량", // discountGrade
  "한 회 건너뛰기 횟수", // countSkipOneTime
  "한 주 건너뛰기 횟수", // countSkipOneWeek
  "구독 취소 사유", // cancelReason
  "상태", // status
  "리뷰 가능", // writeableReview
];

const dataNames = [
    "nextPaymentDate",
    "nextDeliveryDate", 
    "nextPaymentPrice",
    "subscribeCount",
    "discountCoupon",
    "overDiscount",
    "discountGrade",
    "countSkipOneTime",
    "countSkipOneWeek",
    "cancelReason",
    "status",
    "writeableReview",
]

const dataIsDisabled = [
    false,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    true,
]


const cancel = (e) => {
  console.log(e);
  message.error('취소되었습니다.');
};

const DetailsPage = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [dataBase, setDataBase] = useState({
    nextPaymentDate: '',
    nextDeliveryDate: '', 
    nextPaymentPrice: '',
    subscribeCount: '',
    discountCoupon: '',
    overDiscount: '',
    discountGrade: '',
    countSkipOneTime: '',
    countSkipOneWeek: '',
    cancelReason: '',
    status: '',
    writeableReview: '',
  });
  const [isLoading, setIsLoading] = useState(true);

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
    if (id) {
      // ID가 존재하는 경우에만 데이터를 로딩합니다.
      (async () => {
        try {
          const url = `api/admin/new/orders/subscribeGet/${id}`;
          const res = await getData(url);

          if (res?.status === 200) {
            const dataToAssign = res.data ?? {};
            setDataBase(dataToAssign);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false); // 데이터 로딩이 완료되면 로딩 상태를 false로 설정합니다.
        }
      })();
    }
  }, [id]);



  // useEffect(() => {
  //   setIsLoading(true);

  //   // let link = `http://localhost:8080/api/admin/new/orders/subscribeGet/${id}`;
  //   // axios
  //   // .get(link)
  //   // .then(response => {
  //   //   setDataBase(response.data);
  //   // })
  //   // .catch(error => {
  //   //   console.error(error);
  //   // })
  //   // .finally(() => {
  //   //   setIsLoading(false);
  //   // });

  //   try {
  //     (async () => {
  //       const url = `api/admin/new/orders/subscribeGet/${id}`;
  //       const res = await getData(url);

  //       if(res.status === 200){
  //         const dataToAssign = res.data ?? []; // 주어진 데이터
  //         setDataBase(dataToAssign); // 데이터베이스에 할당
  //         setIsLoading(false);
  //       }
  //     })();
  //   } catch (err) {
  //     console.error(err);
  //   }


    

  // }, [id]);

  
  const confirm = () => {

    //console.log(dataBase)
    
    let data = dataBase;

    // let link = `http://localhost:8080/api/admin/new/orders/subscribePost/${id}`;


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
          const url = `api/admin/new/orders/subscribePost/${id}`;
          const res = await postData(url, data);
  
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
      <h1>구독(Subscribe) 상세 페이지</h1>
      <p>DB Subscribe ID: {id}</p>

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