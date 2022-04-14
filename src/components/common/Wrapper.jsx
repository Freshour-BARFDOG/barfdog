import React from 'react';
import s from '/styles/css/Wrapper.module.scss';

function Wrapper(props) {
  return (
    <div className={s.container_outer} style={{backgroundColor: props.bgColor}}>
      <div className={s.container}>
        <div className={s.row}>
          {props.children}
        </div>
      </div>
    </div> 
  );
}

export default Wrapper;