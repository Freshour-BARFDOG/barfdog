import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { message, ConfigProvider, Popconfirm, Button, Input, Select, Space } from 'antd';


const inputNames = [
  "레시피 이름",
  "하루 당 추천 칼로리",
  "다음 결제액",
  "다음 결제일",
];

const confirm = (e) => {
  // console.log(e);
  message.success('수정되었습니다.');
};
const cancel = (e) => {
  // console.log(e);
  message.error('취소되었습니다.');
};

const DetailsPage = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const router = useRouter();
  const { id } = router.query;


  const showConfirmModal = () => {
    setConfirmModalVisible(true);
  };



  return (
    
  <ConfigProvider
  theme={{
    token: {

      colorBgElevated: 'rgba(186, 224, 255, 1)',
      colorBorderBg: 'rgba(0, 0, 0, 1)',
      colorPrimaryBg: 'rgba(0, 0, 0, 1)',


      colorPrimaryBorder: 'rgba(0, 0, 0, 1)',
      colorTextLightSolid: 'rgba(0, 0, 0, 1)',

      // colorBgContainer: 'rgba(0, 0, 0, 1)',
      // colorPrimary: 'rgba(0, 0, 0, 0.2)',

      // colorPrimaryBg: 'rgba(0, 0, 0, 1)',
      // colorPrimaryBgHover: 'rgba(0, 0, 0, 1)',
      // colorPrimaryBgActive: 'rgba(0, 0, 0, 1)',
      // colorError: 'rgba(0, 0, 0, 1)',
      // colorInfo: 'rgba(0, 0, 0, 1)',
      // colorSuccess: 'rgba(0, 0, 0, 1)',
      // colorLink: 'rgba(0, 0, 0, 1)',
      // colorTextBase: 'rgba(0, 0, 0, 1)',
      // colorWarning: 'rgba(0, 0, 0, 1)',
      // colorBgLayout: 'rgba(0, 0, 0, 1)',
      // colorBgMask: 'rgba(0, 0, 0, 1)',
      // colorBgSpotlight: 'rgba(0, 0, 0, 1)',
      // colorBorder: 'rgba(0, 0, 0, 1)',
      // colorBorderSecondary: 'rgba(0, 0, 0, 1)',
      // colorErrorActive: 'rgba(0, 0, 0, 1)',
      // colorFill: 'rgba(0, 0, 0, 1)',
      // colorFillQuaternary: 'rgba(0, 0, 0, 1)',
      // colorFillSecondary: 'rgba(0, 0, 0, 1)',
      // colorFillTertiary: 'rgba(0, 0, 0, 1)',
      // colorInfoActive: 'rgba(0, 0, 0, 1)',
      // colorInfoBg: 'rgba(0, 0, 0, 1)',
      // colorInfoBgHover: 'rgba(0, 0, 0, 1)',
      // colorInfoBorder: 'rgba(0, 0, 0, 1)',
      // colorWarningOutline: 'rgba(0, 0, 0, 1)',
      // colorTextPlaceholder: 'rgba(0, 0, 0, 1)',
      // colorTextLightSolid: 'rgba(0, 0, 0, 1)',
      // colorTextLabel: 'rgba(0, 0, 0, 1)',
      // colorTextHeading: 'rgba(0, 0, 0, 1)',
      // colorTextDisabled: 'rgba(0, 0, 0, 1)',
      // colorTextDescription: 'rgba(0, 0, 0, 1)',
      // colorSplit: 'rgba(0, 0, 0, 1)',
      // colorIconHover: 'rgba(0, 0, 0, 1)',
      // colorIcon: 'rgba(0, 0, 0, 1)',
      // colorHighlight: 'rgba(0, 0, 0, 1)',
      // colorFillContentHover: 'rgba(0, 0, 0, 1)',
      // colorFillContent: 'rgba(0, 0, 0, 1)',
      // colorFillAlternate: 'rgba(0, 0, 0, 1)',
      // colorErrorOutline: 'rgba(0, 0, 0, 1)',
      // colorBorderBg: 'rgba(0, 0, 0, 1)',
      // colorBgTextHover: 'rgba(0, 0, 0, 1)',
      // colorBgTextActive: 'rgba(0, 0, 0, 1)',
      // colorBgContainerDisabled: 'rgba(0, 0, 0, 1)',
      // colorWhite: 'rgba(0, 0, 0, 1)',
      // colorWarningTextHover: 'rgba(0, 0, 0, 1)',
      // colorWarningTextActive: 'rgba(0, 0, 0, 1)',
      // colorWarningBg: 'rgba(0, 0, 0, 1)',
      // colorTextBase: 'rgba(0, 0, 0, 1)',
      // colorText: 'rgba(0, 0, 0, 1)',
      // colorPrimaryTextActive: 'rgba(0, 0, 0, 1)',
      // colorPrimaryText: 'rgba(0, 0, 0, 1)',
      // colorPrimaryHover: 'rgba(0, 0, 0, 1)',
      // colorPrimaryBgHover: 'rgba(0, 0, 0, 1)',
      // colorPrimaryBg: 'rgba(0, 0, 0, 1)',
      // colorBorder: 'rgba(0, 0, 0, 1)',
      // controlTmpOutline: 'rgba(0, 0, 0, 1)',
      // controlOutline: 'rgba(0, 0, 0, 1)',
      // controlItemBgHover: 'rgba(0, 0, 0, 1)',
      // controlItemBgActive: 'rgba(0, 0, 0, 1)',
      // colorTextLightSolid: 'rgba(0, 0, 0, 1)',
      // colorBorderBg: 'rgba(0, 0, 0, 1)',


    },
  }}
>
    <div>
      <h1>Details Page</h1>
      <p>Detail ID: {id}</p>

      {inputNames.map((name, index) => (
        <Input key={index} addonBefore={name} defaultValue="26888888" />
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