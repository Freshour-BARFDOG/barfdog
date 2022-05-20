import React, { useEffect, useRef } from "react";
import s from "./searchBar.module.scss";
import siblings from "@util/func/siblings";

const SearchTerm = ({ searchValue, setSearchValue, title }) => {
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

    const optionalCategory = siblings(target.parentNode)[0];
    const optionalCategoryList = Array.from(optionalCategory.children);
    optionalCategoryList.forEach((t) => t.classList.remove(s.active));
  };

  return (
    <>
      <div className={s["search-row"]}>
        <h4 className={s["title"]}>{title}</h4>
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

          <div data-category={"direct"}>
            <input
              type="date"
              name="directTerm"
              id="startDate"
              data-term-role="start"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.term?.direct?.start || ""}
            />
            <i> ~ </i>
            <input
              type="date"
              name="directTerm"
              id="endDate"
              data-term-role="end"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.term?.direct?.end || ""}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchTerm;
