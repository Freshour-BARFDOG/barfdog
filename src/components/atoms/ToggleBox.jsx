import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { slideDown, slideUp } from '/util/func/slideToggle';
import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import { IoIosArrowForward } from 'react-icons/io';

export const ToggleBoxContext = createContext(() => ({
  setVisible: () => {},
  setId: () => {},
}));

export function ToggleBox({
  title,
  className,
  children,
  disable = false,
  ...props
}) {
  const isVisibleState = false;
  const [visible, setVisible] = useState(isVisibleState);
  const value = useMemo(
    () => ({
      visible,
    }),
    [visible],
  );
  const boxRef = useRef(null);

  const onClickHandler = () => {
    if (disable) return;

    setVisible(!visible);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div
      className={`${s.toggleBox} ${visible ? s.active : ''} ${
        disable ? s.disable : ''
      } ${className ? className : ''}`}
      {...props}
    >
      <button
        className={`${s.clickTrigger} ${disable ? s.disable : ''}`}
        onClick={onClickHandler}
      >
        <h2 className={s.title}>
          {title}
          {!disable && (
            <i>
              <IoIosArrowForward />
            </i>
          )}
        </h2>
      </button>
      <div className={`${s.cont}`} ref={boxRef}>
        <ToggleBoxContext.Provider value={value}>
          {children}
        </ToggleBoxContext.Provider>
      </div>
    </div>
  );
}
