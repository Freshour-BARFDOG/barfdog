




export const Button_EditListOrder = ({ itemList, setEditListOrder, title = '순서편집' }) => {
  const onClickHandler = () => {
    if (itemList.length) {
      setEditListOrder(true);
    }
  };
  return (
    <button
      type="button"
      id="edit_order"
      className="admin_btn line basic_m"
      onClick={onClickHandler}
    >
      {title}
    </button>
  );
};

export const Button_InactiveEditListOrder = ({ itemList, setEditListOrder }) => {
  const onClickHandler = () => {
    if (itemList.length) {
      setEditListOrder(false);
    }
  };
  return (
    <button
      type="button"
      id="set_order"
      className="admin_btn line basic_m point"
      onClick={onClickHandler}
    >
      닫기
    </button>
  );
};
