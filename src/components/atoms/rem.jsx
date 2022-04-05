import React from 'react'


function rem (px) {
  const browserContenxt = 16;
  const calc = Number(px)/browserContenxt;
  console.log(calc);
  return calc+'rem';
}

export default rem