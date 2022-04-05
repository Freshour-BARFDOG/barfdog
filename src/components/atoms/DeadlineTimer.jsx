import React from 'react'
import styled from 'styled-components';
import rem from './rem';


const Dealine_timer = () => {
  const Wrap = ({children}) => {
    const Div = styled.div`
      position:absolute;
      left:50%;
      top:50%;
      min-width:${rem(205)};
      min-width:${rem(305)};
      z-index:999;
      text-align:center;
      color:#000;
      font-size:${rem(16)};
      transform:translateX(-50%);
      padding: ${rem(10)} ${rem(8)};
      box-sizing:border-box;
      background-color:#FFCEBA;
      border-radius:${rem(8)};
    `; 

    return (
      <Div className="deadline_timer">{children}</Div>
    )
  }



  const Text = styled.b`
    font-size: 16px;
    color: var(--color-main);
    margin-right: 7px;       
  `;

  const time = new Date().toISOString();
  return (
    <Wrap>
      <Text>정기구독배송</Text>
      <span id='deadline' style={{'marginRight': `${rem(4)}`}}>{time}</span>
      이후 주문마감!
    </Wrap>
  )
  
}




export default Dealine_timer

