import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Alert, Spin, message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../api/reqData';

const inputNames = [
  "활동량 매우적음", // activityVeryLittle
  "활동량 적음", // activityLittle
  "활동량 중간", // activityNormal
  "활동량 많음", // activityMuch
  "활동량 매우많음", // activityVeryMuch
  "간식량 적음", // snackLittle
  "간식량 중간", // snackNormal
  "간식량 높음", // snackMuch
  "기본 배송비", // price
  "XX원 이상 무료 배송 조건", // freeCondition
];

const dataNames = [
    "activityVeryLittle",
    "activityLittle", 
    "activityNormal",
    "activityMuch",
    "activityVeryMuch",
    "snackLittle",
    "snackNormal",
    "snackMuch",
    "price",
    "freeCondition",
]



const dataIsDisabled = [
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
]


const cancel = (e) => {
  // console.log(e);
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

    // let link = `http://localhost:8080/api/admin/setting`;
    // axios
    // .get(link)
    // .then(response => {

    //   setDataBase(
    //     {
    //       activityVeryLittle: response.data.activityConstant.activityVeryLittle,
    //       activityLittle: response.data.activityConstant.activityLittle,
    //       activityNormal: response.data.activityConstant.activityNormal,
    //       activityMuch: response.data.activityConstant.activityMuch,
    //       activityVeryMuch: response.data.activityConstant.activityVeryMuch,
    //       snackLittle: response.data.snackConstant.snackLittle,
    //       snackNormal: response.data.snackConstant.snackNormal,
    //       snackMuch: response.data.snackConstant.snackMuch,
    //       price: response.data.deliveryConstant.price,
    //       freeCondition: response.data.deliveryConstant.freeCondition,
    //     } );
    // })
    // .catch(error => {
    //   console.error(error);
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });

    

    try {
      (async () => {
        const url = `api/admin/setting`;
        const res = await getData(url);

        if(res.status === 200){
          setDataBase(
            {
              activityVeryLittle: res.data.activityConstant.activityVeryLittle,
              activityLittle: res.data.activityConstant.activityLittle,
              activityNormal: res.data.activityConstant.activityNormal,
              activityMuch: res.data.activityConstant.activityMuch,
              activityVeryMuch: res.data.activityConstant.activityVeryMuch,
              snackLittle: res.data.snackConstant.snackLittle,
              snackNormal: res.data.snackConstant.snackNormal,
              snackMuch: res.data.snackConstant.snackMuch,
              price: res.data.deliveryConstant.price,
              freeCondition: res.data.deliveryConstant.freeCondition,
            } );
          setIsLoading(false);
        }
      })();
    } catch (err) {
      console.error(err);
    }


    

  }, [id]);

  
  const confirm = () => {

    // console.log(dataBase)
    
    let data = dataBase;
    // let data = 
    // {
    //   activityConstant: {
    //     activityVeryLittle: dataBase.activityVeryLittle,
    //     activityLittle: dataBase.activityLittle,
    //     activityNormal: dataBase.activityNormal,
    //     activityMuch: dataBase.activityMuch,
    //     activityVeryMuch: dataBase.activityVeryMuch,
    //   },
    //   snackConstant: {
    //     snackLittle: dataBase.snackLittle,
    //     snackNormal: dataBase.snackNormal,
    //     snackMuch: dataBase.snackMuch,
    //   },
    //   deliveryConstant: {
    //     price: dataBase.price,
    //     freeCondition: dataBase.freeCondition,
    //   },
    // };

    // let link = `http://localhost:8080/api/admin/setting`;


    // axios.put(link, data)
    //   .then(response => {
    //     message.success('수정되었습니다.');
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     message.error('수정에 실패하였습니다.');
    //   });

      

      try {
        (async () => {
          const url = `api/admin/setting`;
          const res = await putObjData(url, data);
  
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

  // console.log(dataBase);



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
      <h1>구독 임의 생성 페이지</h1>

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