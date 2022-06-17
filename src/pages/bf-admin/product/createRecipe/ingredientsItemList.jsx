import React, {useEffect, useState} from 'react';
import IngredientsItem from './ingredientsItem';

export default function IngredientsItemList({newItemObj}) {
  const TEST_DATA = [
    {id: '소', value: false},
    {id: '오리', value: false},
    {id: '양', value: false},
    {id: '칠면조', value: false},
  ];

  // MEMO 기존 레시피에 이미 포함된 재료 여부는  value로 확인한다.
  const allData = TEST_DATA;

  const [itemList, setItemList] = useState(allData);
  const [selectedValues, setSelectedValues] = useState({});

  // console.log(selectedValues);
  console.log(itemList);

  useEffect(() => {
    if (!Object.keys(newItemObj).length) return;

    setItemList((prevState) => [
      ...prevState,
      {
        id: newItemObj.id,
        value: false,
        isNewItem: true,
      },
    ]);
  }, [newItemObj]);

  const onDeleteSelecdValue = (id) => {
    setItemList((prevState) => {
      console.log(prevState);
      let newItemList = [];

      prevState.forEach((thisState) => {
        if (thisState.id === id) return;
        newItemList.push(thisState);
      });
      console.log(newItemList);
      return newItemList;
    });
  };

  return (
    <>
      <ul className={'grid-checkbox-wrap'} style={{maxWidth: '400px'}}>
        {itemList.map((data, index) => {
          return (
            <IngredientsItem
              key={`${data.id}-${index}`}
              data={data}
              index={index}
              itemList={itemList}
              setSelectedValues={setSelectedValues}
              onDelete={onDeleteSelecdValue}
            />
          );
        })}
      </ul>
    </>
  );
}