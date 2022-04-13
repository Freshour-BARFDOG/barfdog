export default function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (let i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function (e) {
    return e != t;
  });
} // siblings
