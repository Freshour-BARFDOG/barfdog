import React, { createContext, useContext, useState } from 'react';
import { Modal_changePassword } from '@src/components/modal/Modal_changePassword';

interface ModelValueInterface{

}

const ModalContext = createContext({
  // 컴포넌트를 포함한 객체가 될 예정이기 때문에, 첫 단어를 대문자로 지정
  event: {
    scrollY: 0,
    setScrollY: ()=> {},
  },
  isActive: false,
  message: null,
  callback: {},
  onShow: () => {}, // Modal 활성
  onHide: () => {}, // Modal 비활성
  alertShow: (message?:string, cb?:Function) => {}, // AlertModal 활성
  alertHide: () => {},// AlertModal 비활성
  hasAlert:false,// AlertModal 활성 여부
  subscribe: {
    isActive: false,
    onShow: ()=>{},
    onHide: ()=>{},
  },
  ChangePW:{
    onShow: ()=>{},
    onHide: ()=>{},
  }
});

const useModalContext = () => useContext(ModalContext);

const ModalContextProvider = ({ children, ...props }) => {
  const [isActive, setIsActive] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [isActiveSubscribeModal, setIsActiveSubscribeModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeChangePasswordModal, setActiveChangePasswordModal] = useState( false );
  const [callback, setCallback] = useState({} );
  
  const onShowHandler = () => {
    setIsActive(true);
  };
  const onHideHandler = () => {
    setIsActive(false);
  };

  const onAlertShow = (message, cb) => {
    setHasAlert(true);
    setAlertModalMessage(message);
    setCallback({ alert: cb });
  };

  const onAlertHide = () => {
    setHasAlert(false);
    setAlertModalMessage('');
  };

  const onSubScribeModalShow = () => {
    setIsActiveSubscribeModal(true);
  };

  const onSubScribeModalHide = () => {
    setIsActiveSubscribeModal(false);
  };

  const onSetModalScrollPos = () => {
    const Y = window ? window.scrollY : 0;
    setScrollY(Y);
  };
  
  
  const onShowChagnePasswordModal  = ()=>{
    setActiveChangePasswordModal(true)
  }
  const onHideChagnePasswordModal  = ()=>{
    setActiveChangePasswordModal(false)
  }




  return (
    <ModalContext.Provider
      value={{
        event: {
          scrollY: scrollY,
          setScrollY: onSetModalScrollPos,
        },
        isActive: isActive,
        hasAlert: hasAlert,
        onShow: onShowHandler,
        onHide: onHideHandler,
        alertShow: onAlertShow,
        alertHide: onAlertHide,
        message: alertModalMessage,
        callback: callback,
        subscribe: {
          isActive: isActiveSubscribeModal,
          onShow: onSubScribeModalShow,
          onHide: onSubScribeModalHide,
        },
        ChangePW:{
          onShow: onShowChagnePasswordModal,
          onHide: onHideChagnePasswordModal,
        }
      }}
    >
      {children}
      {activeChangePasswordModal && <Modal_changePassword onHideModal={onHideChagnePasswordModal} active={activeChangePasswordModal}/>}
    </ModalContext.Provider>
  );
};

export default ModalContext;
export { useModalContext, ModalContextProvider };
