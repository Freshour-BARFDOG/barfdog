




const Button_acceptClickEvent = ({ title, onClick }) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === "function") onClick(true);
  };
  return (
    <button
      type="button"
      id="set_order"
      className="admin_btn line basic_m"
      onClick={onClickHandler}
    >
      {title}
    </button>
  );
};

export default Button_acceptClickEvent;;
