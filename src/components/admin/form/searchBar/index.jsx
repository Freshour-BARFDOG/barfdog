import React, {useState} from 'react';
import s from './searchBar.module.scss'
import siblings from '@util/func/siblings';



const SearchTerm = ({ searchValue, getValue }) => {
  const [activeType, setActiveType] = useState("optional");

  const onClickHandler = (e) => {
    const btn = e.currentTarget;
    const type = e.currentTarget.parentNode.dataset.type;
    console.log(type)
    const selectedTerm = btn.dataset.term;
    btn.classList.add(s.active);
    siblings(btn).forEach(t=> t.classList.remove(s.active));

    getValue({
      ...searchValue,
      term: {[type]: selectedTerm},
    });
  };
// 직접입력을 한다면,
 // 조회기간은 무시해야한다



  return (
    <>
      <div data-type={"optional"}>
        <button
          onClick={onClickHandler}
          data-term={"0"}
          className={`admin_btn line basic_l`}
        >
          오늘
        </button>
        <button
          onClick={onClickHandler}
          data-term={"3"}
          className="admin_btn line basic_l"
        >
          3일
        </button>
        <button
          onClick={onClickHandler}
          data-term={"7"}
          className="admin_btn line basic_l"
        >
          7일
        </button>
        <button
          onClick={onClickHandler}
          data-term={"30"}
          className="admin_btn line basic_l"
        >
          30일
        </button>
        <button
          onClick={onClickHandler}
          data-term={"60"}
          className="admin_btn line basic_l"
        >
          60일
        </button>
        <button
          onClick={onClickHandler}
          data-term={"120"}
          className="admin_btn line basic_l"
        >
          120일
        </button>
        <button
          onClick={onClickHandler}
          data-term={"all"}
          className="admin_btn line basic_l"
        >
          전체
        </button>
      </div>
      <div data-type={"direct"}>
        <input type="date" name="directTerm" id="startDate" />
        <i> ~ </i>
        <input type="date" name="directTerm" id="endDate" />
      </div>
    </>
  );
};





function SearchBar() {
  const [searchValue, setSearchValue] = useState({
    term:''
  });


  console.log(searchValue);;


  return (
    <div id={s.searchBar}>
      <div className={s["search-section"]}>
        <div className={s["search-row"]}>
          <span className={s["title"]}>조회기간</span>
          <div className={`${s["inp-wrap"]} ${s["term"]}`}>
            <div className={s["inner-row"]}>
              <SearchTerm searchValue={searchValue} getValue={setSearchValue} />
            </div>
            <div className={s["inner-row"]}></div>
          </div>
        </div>
      </div>
      <div className={s["btn-section"]}>
        <button className="admin_btn solid confirm_m">검색</button>
        <button className="admin_btn line confirm_m">초기화</button>
      </div>
    </div>
  );
}

export default SearchBar;