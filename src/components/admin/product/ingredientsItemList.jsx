import React, { useEffect, useRef, useState } from 'react';
import IngredientsItem from './ingredientsItem';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import enterKey from '/util/func/enterKey';
import {getData} from "/api/reqData";
import Spinner from "/src/components/atoms/Spinner";


export default function IngredientsItemList({ id, formValues, setFormValues }) {
  
  const getAllRecipeIngredientListApiUrl = '/api/recipes/ingredients';
  const [isLoading, setIsLoading] = useState( false );
  const addIngredientInputRef = useRef(null);
  const [isImportingOriginItemListCompleted, setIsImportingOriginItemListCompleted] = useState( false );
  const [itemList, setItemList] = useState([]); //
  const [innerFormErrors, setInnerFormErrors] = useState('');
  
  
  useEffect(() => {
    // Init
    (async ()=>{
      try {
        setIsLoading(true);
        const regacyIngredientList = [];
        const res = await getData(getAllRecipeIngredientListApiUrl);
        console.log(res);
        const allRegisteredRecipeIngredientList = res?.data._embedded.stringList || [];
        if (allRegisteredRecipeIngredientList.length) {
          allRegisteredRecipeIngredientList.forEach((ingredientName) => {
            const itemObj = {
              id: ingredientName,
              value: false,
              deletable: false // 삭제불가능함
            };
            regacyIngredientList.push(itemObj);
          });
        }
        setItemList(prevList =>regacyIngredientList.length ? regacyIngredientList.concat(prevList) : prevList);
      } catch (err) {
        console.error(err)
      }
      setIsLoading(false);
    })();
  }, []);
  
  
  
  
  
  const onClickCheckbox = async (targetId, checkedOnThisCheckbox) => {
    
    const checkedValueArr= [];
    await setItemList((prevState) => prevState.map(item=>{
      if(item.id === targetId){
        checkedOnThisCheckbox === false && checkedValueArr.push(item.id);
      }else {
        item.value && checkedValueArr.push(item.id);
      }

      return ({
        ...item,
        value: item.id === targetId ? !checkedOnThisCheckbox : item.value
      })
    }));
    
    const transformValueToStringWithComma  = checkedValueArr.join(',');
    setFormValues((prevState) => ({
      ...prevState,
      [id]: transformValueToStringWithComma
    }));
  };
  
  
  
  // ! 삭제했을 때, 삭제한 놈은....formvalue에서 제거한다.
  
  useEffect( () => {
    // ! important 현재 recipe에 기존 등록된 ingredient list -> itemlist에 추가
    if(isImportingOriginItemListCompleted) return;
    const originItemList = formValues[id] && transformStringWithCommanToArray(formValues[id])
    setIsImportingOriginItemListCompleted(true); // ! 실행 순서 중요
    const emptyValue = !originItemList[0];
    if(emptyValue) return;
    const convertedOriginItemList = originItemList.map(ingredient=>({
      id:ingredient,
      value: true,
      deletable: true
    }))
    setItemList(prevState => prevState.concat(convertedOriginItemList));
  }, [formValues[id]] );
  
  
  const onAddIngredient = () => {
    const input = addIngredientInputRef.current;
    const newItemId = input.value;
    setInnerFormErrors(newItemId ? '' : '입력된 값이 없습니다.');
    if (!newItemId || isLoading) return;
    
    setItemList((prevState) => {
      let error;
      let newItemList = [
        ...prevState,
        {
          id: newItemId,
          value: false,
          deletable: true,
        },
      ];
      prevState.forEach((item) => {
        if (item.id === newItemId) {
          return (error = '이미 존재하는 재료명입니다.');
        }
      });
      setInnerFormErrors(error);
      input.value = '';
      return error ? prevState : newItemList;
    });
  };

  const onDeleteIngredient = (thisIngredientId) => {
    setItemList((prevState) => prevState.filter((list) => list.id !== thisIngredientId));
    
    setFormValues(prevState => {
      const curItemList = transformStringWithCommanToArray(prevState[id]);
      const newItemList = curItemList.filter((list) => list !== thisIngredientId).join(',')
      return {
        ...prevState,
        [id]: newItemList
      }
    })
  };
  

  const onKeyboardHandler = (event) => {
    enterKey(event, onAddIngredient);
  };
  
  
  const onBlurHandler= ()=>{
    setInnerFormErrors('');
  }
  

  return (
    <>
      <div className="inp_box">
        <input
          id={'addIngredients'}
          type="text"
          name="ingredients"
          ref={addIngredientInputRef}
          onKeyDown={onKeyboardHandler}
          onBlur={onBlurHandler}
        />
        <button type={'button'} className={`admin_btn solid basic_l ${isLoading ? 'disabled' : ''}`} onClick={onAddIngredient} disabled={isLoading}>
          {isLoading ? <Spinner style={{color:'#fff'}}/> : '추가'}
        </button>
        {innerFormErrors && <ErrorMessage>{innerFormErrors}</ErrorMessage>}
      </div>
      {itemList.length > 0 && (
        <ul className={'grid-checkbox-wrap'} style={{ maxWidth: '400px' }}>
          {itemList.map((data, index) => {
            return (
              <IngredientsItem
                key={`${data.id}-${index}`}
                data={data}
                index={index}
                itemList={itemList}
                onDelete={onDeleteIngredient}
                setValue={onClickCheckbox}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}


const transformStringWithCommanToArray = (str)=>{
  return str.replace(/\s/g, '').split(',');
}
