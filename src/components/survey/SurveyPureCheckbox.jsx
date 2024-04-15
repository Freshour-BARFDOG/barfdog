import React, { useRef } from 'react';
import s from 'src/components/atoms/pureCheckbox.module.scss';

const PureCheckbox = ({
  id,
  children,
  className,
  value,
  setValue,
  eventHandler,
  errorMessage,
  onClick,
  theme,
  disabled,
  returnBoolean,
  option = {
    position: 'left',
  },
  dogInfoIndex,
  ...props
}) => {
  const inputRef = useRef();

  const onChangeHandler = () => {
    const input = inputRef.current;
    const { id, checked } = input;

    // // console.log('id:', id, ' checked:', checked);
    // if (returnBoolean) {
    //   setValue(checked, id);
    // } else if (eventHandler && typeof eventHandler === 'function') {
    //   eventHandler(checked);
    // } else if (setValue && typeof setValue === 'function') {
    // 내용 업데이트
    setValue((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            oldDog: !item.oldDog,
          };
        }
        return item;
      });

      return newFormValues;
    });

    // setValue((prevState) => ({
    //   ...prevState,
    //   [id]: checked,
    // }));
  };
  // };

  const onClickHandler = () => {
    const input = inputRef.current;
    const { id, checked } = input;
    // // console.log('id:', id, ' checked:', checked);
    // if (onClick && typeof onClick === 'function') {
    // 내용 업데이트
    setValue((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            oldDog: !item.oldDog,
          };
        }
        return item;
      });

      return newFormValues;
    });
  };
  // };

  return (
    <>
      <div
        className={`${s['checkbox-wrap']} ${theme ? s[theme] : ''}${
          children ? '' : s.onlyCheckbox
        }`}
      >
        <label
          htmlFor={id}
          className={`${s.checkbox} ${
            option.position === 'right' ? s['position-right'] : ''
          } ${disabled ? s.disabled : ''} ${className || ''}`}
          {...props}
          onClick={onClickHandler}
        >
          {option.position === 'right' && children}
          <input
            ref={inputRef}
            onChange={onChangeHandler}
            type="checkbox"
            id={id}
            checked={value}
            disabled={disabled}
          />
          <span className={s.fakeCheckBox} />
          {option.position === 'left' && children}
        </label>
        {errorMessage}
      </div>
    </>
  );
};

export default PureCheckbox;
