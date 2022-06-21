import React from 'react';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import CloseButton from '/src/components/atoms/CloseButton';
import rem from '/util/func/rem';

export default  function IngredientsItem({data, index, itemList, setSelectedValues, onDelete}) {
  const key = Object.keys(itemList)[index].id;
  const onDeleteHandler = (e) => {
    const id = e.currentTarget.dataset.id;
    onDelete(id);
  };

  return (
    <li key={`${data.id}-${index}`}>
      <PureCheckbox id={data.id} value={itemList[index][key]} setValue={setSelectedValues}>
        <span style={{fontSize: `${rem(16)}`}}>{data.id}</span>
      </PureCheckbox>
      {data.isNewItem && (
        <span className={'btn-wrap'}>
          <CloseButton
            data-id={data.id}
            onClick={onDeleteHandler}
            lineColor={'var(--color-line-02)'}
            style={{width: `${rem(14)}`, height: `${rem(14)}`}}
          />
        </span>
      )}
    </li>
  );
};