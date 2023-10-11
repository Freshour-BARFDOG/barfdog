import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Alert, Spin, message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../api/reqData';

const inputNames = [
  "삭제여부",
  "대표견여부",
  "이름",
  "성별",
  "생일",
  "바프독 등록 시점시, 강아지 나이(개월 수)",
  "노령견 여부",
  "견종",
  "사이즈",
  "무게",
  "중성화 여부",
  "활동량",
  "산책 횟수",
  "산책 시간",
  "상태",
  "간식 횟수",
  "못 먹는 음식",
  "못 먹는 음식 기타",
  "질병 및 주의사항",


];

const dataNames = [
  "deleted",
  "representative",
  "name",
  "gender",
  "birth",
  "startAgeMonth",
  "oldDog",
  "dogType",
  "dogSize",
  "weight",
  "neutralization",
  "activityLevel",
  "walkingCountPerWeek",
  "walkingTimePerOneTime",
  "dogStatus",
  "snackCountLevel",
  "inedibleFood",
  "inedibleFoodEtc",
  "caution",
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
  false,
  false,
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

    // let link = `http://localhost:8080/api/admin/new/orders/dogGet/${id}`;
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
        const url = `api/admin/new/orders/dogGet/${id}`;
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

    //console.log(dataBase)
    
    let data = dataBase;

    // let link = `http://localhost:8080/api/admin/new/orders/dogPost/${id}`;


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
          const url = `api/admin/new/orders/dogPost/${id}`;
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

  //console.log(dataBase["orderCancel"]);



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
      <h1>견(Dog) 상세 페이지</h1>
      <p>DB Dog ID: {id}</p>

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