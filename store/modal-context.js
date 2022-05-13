import React, {createContext,  useState, useContext } from "react";



const ModalContext = createContext({
  // 컴포넌트를 포함한 객체가 될 예정이기 때문에, 첫 단어를 대문자로 지정
  onShow: () => {
    console.log("모달: 활성");
    console.log(this);
  },
  onHide: () => {
    console.log("모달: 비활성");
  },
});

const AlertModalContext = createContext({
  // 컴포넌트를 포함한 객체가 될 예정이기 때문에, 첫 단어를 대문자로 지정
  onShow: () => {
  },
  onHide: () => {
  },
});


const useModalContext = () => useContext(ModalContext);
const useAlertModalContext = () => useContext(AlertModalContext);



 






const ModalContextProvider = ({children}) => {


  const [isActive, setIsActive] = useState(true);
  const [hasAlert, setHasAlert] = useState(false);
  const [message, setAlertMessage] = useState('');

  const onShowHandler = () => {
    setIsActive(true);
  };
  const onHideHandler = () => {
    setIsActive(false);
  };

  const onAlertShowHandler = (message) => {
     setHasAlert(true);
     setAlertMessage(message);
  }

  const onAlertHideHandler = () => {
    setHasAlert(false);
     setAlertMessage('');
  };


  return (
    <ModalContext.Provider
      value={{
        isActive: isActive,
        hasAlert: hasAlert,
        onShow: onShowHandler,
        onHide: onHideHandler,
        alertShow: onAlertShowHandler,
        alertHide: onAlertHideHandler,
        message: message,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};



export default ModalContext;
export { useModalContext, ModalContextProvider };