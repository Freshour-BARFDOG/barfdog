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



const useModalContext = () => useContext(ModalContext);


const ModalContextProvider = ({children}) => {

  const [isActive, setIsActive] = useState(false);

  const onShowHandler = () => {
    setIsActive(true);
  };
  const onHideHandler = () => {
    setIsActive(false);
  };


  return (
    <ModalContext.Provider
      value={{
        isActive: isActive,
        onShow: onShowHandler,
        onHide: onHideHandler,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};



export default ModalContext;
export { useModalContext, ModalContextProvider };