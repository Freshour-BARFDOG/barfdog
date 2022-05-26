import React, { useEffect, useRef } from "react";
import s from "./searchBar.module.scss";
import siblings from "@util/func/siblings";
import ToolTip from "@src/components/atoms/Tooltip";





const SearchTerm = ({ searchValue, setSearchValue, title, tooltip }) => {
  const optionalRef = useRef();



  useEffect(() => {
     if (!searchValue && optionalRef.current) {
       initializeOptionalButtons();
     }
  }, [searchValue]);



  const initializeOptionalButtons = () => {
    const optionalButtons = Array.from(optionalRef.current.children);
    optionalButtons.map((t) => t.classList.remove(s.active));
  }




  const onOptionalTermHandler = (e) => {
    const target = e.currentTarget;
    const value = target.dataset.value;
    const category = target.parentNode.dataset.category;

    setSearchValue((prevState) => ({
      ...prevState,
      term: {
        [category]: value,
      },
    }));
    target.classList.add(s.active);
    siblings(target).forEach((t) => t.classList.remove(s.active));
  };



  const onDriectTermHandler = (e) => {
    const target = e.currentTarget;
    const value = target.value;
    const role = target.dataset.termRole;
    const category = target.parentNode.dataset.category;
  
    setSearchValue((prevState) => ({
      ...prevState,
      term: {
        [category]: { ...prevState.term?.direct, [role]: value },
      },
    }));

    const optionalCategoryList = Array.from(optionalRef.current.children);
    optionalCategoryList.forEach((t) => t.classList.remove(s.active));
  };



  return (
    <>
      <div className={s["search-row"]}>
        <h4 className={s["title"]}>
          {title}
          {tooltip && <span className={s["tooltip-wrap"]}>{tooltip}</span>}
        </h4>
        <div className={`${s["inp-wrap"]} ${s["term"]}`}>
          <div data-category={"optional"} ref={optionalRef}>
            <button
              onClick={onOptionalTermHandler}
              data-value={"0"}
              className={`admin_btn line basic_l`}
            >
              오늘
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"3"}
              className="admin_btn line basic_l"
            >
              3일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"7"}
              className="admin_btn line basic_l"
            >
              7일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"30"}
              className="admin_btn line basic_l"
            >
              30일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"60"}
              className="admin_btn line basic_l"
            >
              60일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"120"}
              className="admin_btn line basic_l"
            >
              120일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={"all"}
              className="admin_btn line basic_l"
            >
              전체
            </button>
          </div>
        </div>
        <div className={`${s["inp-wrap"]} ${s["term"]}`}>
          <div data-category={"direct"}>
            <input
              type="date"
              name="directTerm"
              id="startDate"
              data-term-role="from"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.term?.direct?.from || ""}
            />
            <i> ~ </i>
            <input
              type="date"
              name="directTerm"
              id="endDate"
              data-term-role="to"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.term?.direct?.to || ""}
            />
            <i className={s["icon-wrap"]}>
              <ToolTip message="조회 시작일과 마침일은 선택된 기간을 자동으로 비교하여 반영됩니다." />
            </i>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchTerm;









const sortingDateOrder = (obj, secondDate) => {
  let sortingDate;
  const keys = Object.keys(obj);
  let tempValueArr = [];


  const convertingDate = (date) => {
    let convertedDate;
    const val = new String(date);
    return (convertedDate = Number(val.replace(/-/g, "")));
  };

  if (keys.length > 1){
    // * 검색하는 순간에 Sorting 적용
    // keys.forEach((key) => {
    //   const tempDate = convertingDate(obj[key]);
    //   tempValueArr.push(tempDate);
    // });
    const tempDate1 = convertingDate(obj[keys[0]]);
    const tempDate2 = convertingDate(secondDate);
    tempValueArr.push(tempDate1, tempDate2);
  }
  


  tempValueArr.sort((a, b) => {
    return a - b; // 오름차순 정렬
  });

  const convertDateArr = tempValueArr.map((val) => {
    const date = String(val);
    const yyyy = date.slice(0, 4);
    const mm = date.slice(4, 6);
    const dd = date.slice(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  });

  sortingDate = {
    from: convertDateArr[0],
    to: convertDateArr[1],
  };

  return sortingDate
};








// const valiDateBothDateKey = (obj, role) => {
//   let validate = false;
//   if (obj) {
//     const keys = Object.keys(obj);
//     keys.forEach((key) => {
//       if (key !== role) validate = true;
//     });
//   }
//   return validate;
// };



// * 1. from, to 값이 2가지 인지 확인
// * 2. 데이터 정렬



// const sortingDateOrder = (obj, secondDate) => {
//   let sortingDate;
//   const keys = Object.keys(obj);
//   let tempValueArr = [];

//   const convertingDate = (date) => {
//     let convertedDate;
//     const val = new String(date);
//     return (convertedDate = Number(val.replace(/-/g, "")));
//   };

//   console.log(keys.length);
//   console.log(obj);
//   keys.forEach((key) => {
//     const tempDate = convertingDate(obj[key]);
//     tempValueArr.push(tempDate);
//   });
 
//   tempValueArr.sort((a, b) => {
//     return a - b; // 오름차순 정렬
//   });

//   const convertDateArr = tempValueArr.map((val) => {
//     const date = String(val);
//     const yyyy = date.slice(0, 4);
//     const mm = date.slice(4, 6);
//     const dd = date.slice(6, 8);
//     return `${yyyy}-${mm}-${dd}`;
//   });

//   sortingDate = {
//     from: convertDateArr[0],
//     to: convertDateArr[1],
//   };

//   return sortingDate;
// };
