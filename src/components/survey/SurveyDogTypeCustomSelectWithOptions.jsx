import React, { useEffect, useRef, useState } from 'react';
import s from './surveyDogTypeCustomSelectWithOptions.module.scss';
import rem from '/util/func/rem';
import ScrollContainer from '/src/components/atoms/ScrollContainer';

export const SurveyDogTypeCustomSelectWithOptions = ({
  id,
  options,
  width,
  value,
  // formValues,
  setFormValues,
  viewerWidth,
  // dogInfo,
  dogInfoIndex,
  activeIndexList,
  setActiveIndexList,
}) => {
  const initialSelectedOption = value[id] || options[0]?.value || '';
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  // const initialIsActiveStates = Array(formValues.length).fill(false);
  // const [isActive, setIsActive] = useState(initialIsActiveStates);
  const [isActive, setIsActive] = useState(false);

  const [keyword, setKeyword] = useState('');

  const optionBoxRef = useRef(null);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);

  // // formValues의 길이가 변경될 때마다 isActive 상태를 재설정
  // useEffect(() => {
  //   setIsActive(Array(formValues.length).fill(false));
  // }, [formValues.length]);

  useEffect(() => {
    // cookie를 통하여, 기본 값이 존재할 경우
    if (initialSelectedOption) {
      setSelectedOption([initialSelectedOption]);
    }
  }, [initialSelectedOption]);

  useEffect(() => {
    // HIDE Option
    const optionBox = optionBoxRef.current;
    const viewer = inputRef.current;
    const searchInput = searchInputRef.current;

    if (window && typeof window !== 'undefined' && optionBox && searchInput) {
      document.body.addEventListener('click', (e) => {
        let isBoxClicked = false;
        const clickedTarget = e.target;
        const targetList = [
          clickedTarget,
          ...Array.from(clickedTarget.children),
        ];

        const deceptListDepth2 = [];
        const deceptListDepth1 = [...Array.from(optionBox.children)];
        deceptListDepth1.forEach((ch1) => {
          Array.from(ch1.children).forEach((ch2) => {
            deceptListDepth2.push(ch2);
          });
        });
        const exceptList = [
          searchInput,
          viewer,
          ...Array.from(optionBox.children),
          ...deceptListDepth2,
        ];
        targetList.forEach((target) => {
          const targetClassName = target.className;
          const exceptClassNameList = exceptList.map((list) => list.className);

          if (
            exceptClassNameList.indexOf(targetClassName) == 1 ||
            exceptClassNameList.indexOf(targetClassName) == 0
          ) {
            isBoxClicked = true;
            return;
          }
        });

        setIsActive(isBoxClicked);
      });
    }
  }, [optionBoxRef.current]);

  const onOptionClick = (e) => {
    e.preventDefault(); // 스크롤 올라가는거 방지
    const option = e.currentTarget;
    const value = option.dataset.value;
    setSelectedOption(value);

    // 선택지 리스트 닫기
    // if (option) {
    // console.log('option', option);
    // setIsActive(false);
    setActiveIndexList((prevIndexList) => {
      if (prevIndexList?.includes(dogInfoIndex)) {
        return prevIndexList.filter((idx) => idx === dogInfoIndex);
      }
      return prevIndexList;
    });
    // }

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [id]: value,
          };
        }
        return item;
      });

      return newFormValues;
    });
  };

  // 화면 바깥 클릭해도 닫히게
  useEffect(() => {
    if (!isActive) {
      setActiveIndexList((prevIndexList) => {
        if (prevIndexList?.includes(dogInfoIndex)) {
          return prevIndexList.filter((idx) => idx !== dogInfoIndex);
        }
        return prevIndexList;
      });
    }
  }, [isActive]);

  const onSearchHandler = (e) => {
    const value = e.currentTarget.value;
    setKeyword(value);
  };

  const onActiveOptionBox = (e) => {
    e.stopPropagation();

    setIsActive(!isActive);

    setActiveIndexList((prevIndexList) => {
      if (prevIndexList?.includes(dogInfoIndex)) {
        return prevIndexList.filter((idx) => idx !== dogInfoIndex);
      } else {
        return [...prevIndexList, dogInfoIndex];
      }
    });
  };

  const Options = ({ label, value, index }) => {
    return (
      <p
        data-value={value}
        className={`${s.option} ${
          selectedOption[index] === value ? s.selected : ''
        }`}
        onClick={(e) => onOptionClick(e)}
      >
        {label}
      </p>
    );
  };

  // 검색창 클릭해도 선택지 리스트는 열려있음
  const onSearchClickHandler = (e) => {
    e.stopPropagation();
    setIsActive(true);
  };

  // console.log('isActive>>>', isActive);
  // console.log('activeIndexList>>>', activeIndexList);
  // console.log('selectedOption', selectedOption);

  return (
    <>
      <div
        className={`${s.selectDogBreed}`}
        style={{ width: `${rem(width)}` }}
        onClick={(e) => onActiveOptionBox(e)}
      >
        <div
          className={s.viewer}
          ref={inputRef}
          style={{
            width: `${rem(viewerWidth)}`,
            maxWidth: `${rem(viewerWidth)}`,
          }}
        >
          {selectedOption === '' ? '견종을 선택해주세요.' : selectedOption}
        </div>
        <div
          className={`${
            activeIndexList?.includes(dogInfoIndex) ? s.active : ''
          } ${s['modal-selectDogBreed']}`}
        >
          <input
            type="text"
            id={id}
            placeholder="견종을 입력하세요"
            className={s.search}
            value={keyword}
            onChange={onSearchHandler}
            ref={searchInputRef}
            onClick={(e) => onSearchClickHandler(e)}
          />
          <ScrollContainer
            height={options.length > 4 ? 143 : ''}
            scrollBarWidth={options.length > 4 ? '8' : '0'}
            className={`${s.scrollContainer}}`}
            ref={optionBoxRef}
          >
            {options.map((option, i) => {
              const searchResult = option.value.includes(keyword);
              return (
                <div key={`${option.value}-${i}`} className={s.option}>
                  {keyword.length ? (
                    <>
                      {searchResult && (
                        <Options
                          label={option.label}
                          value={option.value}
                          index={i}
                        />
                      )}
                    </>
                  ) : (
                    <Options
                      label={option.label}
                      value={option.value}
                      index={i}
                    />
                  )}
                </div>
              );
            })}
          </ScrollContainer>
        </div>
      </div>
    </>
  );
};
