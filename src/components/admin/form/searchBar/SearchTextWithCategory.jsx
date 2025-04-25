import { useState } from "react";
import s from "./searchBar.module.scss";


const SearchTextWithCategory = ({
  searchValue,
  setSearchValue,
  title,
  name,
  id,
  tooltip,
  className,
  options = [],
  searchButton,
  placeholder ="",
  events={
    onSelect: null,
    onKeydown:null,
  },
  searchInputName,
}) => {

  const initialCategory = options[0].value || '';
  const [selectedCategory, setSelectedCategory] = useState(searchInputName || initialCategory);


  const onSelectChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const selectedVal = thisSelect.value;
    if (searchInputName) {
      setSearchValue((prevState) => ({
        ...prevState,
        [name]: selectedVal,
      }));
    } else {
      setSelectedCategory(selectedVal);
      if(events.onSelect && typeof events.onSelect === 'function' ){
        events.onSelect(selectedVal);
      }
      const searchQuery = selectedVal;
      setSearchValue((prevState) => {
        let tobeInitializedValueObj = {}
        options.forEach(option=> {
          if(option.value !== searchQuery){
            tobeInitializedValueObj = {
              ...tobeInitializedValueObj,
              [option.value]: ''
            }
          }
        });
        return {
        ...prevState,
          [searchQuery]: '',
          ...tobeInitializedValueObj,
        }
      });
    }
  };

  const onInputChangeHandler = (e) => {
    const { value } = e.currentTarget;
    setSearchValue((prevState) => ({
      ...prevState,
      [selectedCategory]: value,
    }));
  };
  
  
  
  if (!options.length) return;

  return (
    <>
      <div className={`${s["search-row"]} ${className || ''}`}>
        {title && <label className={s["title"]} htmlFor={'popup-searchUser-keyword'}>
          {title}
          {tooltip && <span className={s["tooltip-wrap"]}>{tooltip}</span>}
        </label>}
        <div className={`${s["inp-wrap"]} ${s["textWidhCategory"]}`}>
          <select
            className="admin_select"
            name={name}
            id={id || name}
            onChange={onSelectChangeHandler}
            value={!searchInputName ? selectedCategory : searchValue[name]}
          >
            {options.map((option, i) => {
              return i === 0 ? (
                <option
                  key={`${option.label}-${i}`}
                  value={option.value}
                  defaultValue
                >
                  {option.label}
                </option>
              ) : (
                <option key={`${option}-${i}`} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <input
            id={"popup-searchUser-keyword"}
            type="text"
            onChange={onInputChangeHandler}
            onKeyDown={events.onKeydown}
            value={searchValue[selectedCategory] || ''}
            placeholder={placeholder}
          />
          {searchButton}
        </div>
      </div>
    </>
  );
};

export default SearchTextWithCategory;
