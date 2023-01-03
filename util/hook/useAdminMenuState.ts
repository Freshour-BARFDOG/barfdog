import {useEffect, useState} from "react";


const storageName: string = "Barfdog.admin.menu.isfolded";

export const useAdminMenuState = ({folded = false}) => {
  
  
  const initialState = {
    folded: folded
  }
  
  const [adminMenuState, setAdminMenuState] = useState(initialState);
  
  useEffect(() => {
    const storedFoldedState = localStorage.getItem(storageName);
    setAdminMenuState(prevState => ({
      ...prevState,
      folded: convertStringToBooleanState(storedFoldedState)
    }));
  }, []);
  
  
  const getMenuState = () => {
    return localStorage.getItem(storageName);
  };
  const setToogleMenuState = () => {
    const curState = getMenuState();
    const storedFoldedState: string = curState === "false" ? "true" : "false";
    localStorage.setItem(storageName, storedFoldedState);
    setAdminMenuState(prevState => ({
      ...prevState,
      folded: convertStringToBooleanState(storedFoldedState)
    }))
  };
  
  
  const convertStringToBooleanState = (stringState: string) => {
    return stringState === "true";
  }
  
  return [adminMenuState, setToogleMenuState];
  
};
