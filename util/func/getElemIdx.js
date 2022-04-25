

const getElemIdx  = (child) => {

  const target = child;
  const children = [...target.parentNode.children];
  const targetIdx = children.indexOf(target);
  return targetIdx;
};

export default getElemIdx;
