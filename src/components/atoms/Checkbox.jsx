import React , {useState, useEffect} from 'react';
import { Form,  Checkbox as AntdCheckbox, } from "antd"
import s from './checkbox.module.scss';

export function Title (props) {
  return (
    <header className={s.title}>
      <h2>{props.name}</h2>
    </header>
  )
}



export function Btn (props) {
  const test = props.style === 'white' ? 'white' : "red" ;
  
  return(
    <div className={s.btn_group}>
      <div className={`${s.btn} ${s[test]}`}>
        {props.name}
      </div>
    </div>
  )
}


export function CustomCheck ({ value=[], options=[], onChange=()=>{} }) {
    const { status, errors } = Form.Item.useStatus();
    const [checkedList, setCheckedList] = useState(value);

    useEffect(() => {
        onChange(checkedList)
    }, [checkedList]);

    const checkAll = options.length === checkedList?.length;
    const indeterminate = checkedList?.length > 0 && checkedList?.length < options.length;

    const onChangeGroup = (list) => {
        setCheckedList(list);
        // onChange(list);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? 
            (Array.isArray(options) && typeof options[0] === "object" ? 
            options.map(e=>e.value) : options) 
            : []);
        // onChange(e.target.checked ? plainOptions : []);
    };

    return (
        <>
            <AntdCheckbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </AntdCheckbox>
            <AntdCheckbox.Group options={options} value={checkedList} onChange={onChangeGroup} />
        </>
    );
  };



export default function Checkbox({ id, label, callback, onClick ,labelStyle, checked,  ...props}) {
  
  const onChangeHandler = (e) => {
    const { checked, id } = e.currentTarget;
    if (callback && typeof callback === "function") callback(checked, id);
  };

  const onClickHandler = (e) => {
    const { checked, id } = e.currentTarget;
    if (onClick && typeof onClick === "function") onClick(checked, id);
  }


  return (
    <label htmlFor={id} className={s.chk_box} {...props}>
      <input
        type="checkbox"
        id={id}
        onChange={onChangeHandler}
        onClick={onClickHandler}
        checked={checked}
      />
      <i className={`${s.on} ${!label ? s.noLabel : ''}`} />
      <span className={s.label} style={labelStyle}>{label}</span>
    </label>
  );
}