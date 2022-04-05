
function rem (px) {
  const browserContenxt = 16;
  const calc = Number(px)/browserContenxt;
  return calc+'rem';
}

export default rem