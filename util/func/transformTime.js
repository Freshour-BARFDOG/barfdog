const transformTime = (num) => {
  if (typeof num !== "number") return;
  let time;
  const sec = num % 60 < 10 ? "0" + (num % 60) : num % 60; // 10보다 작을때는
  const min = Math.floor(num / 60) ? Math.floor(num / 60) : 0;

  return (time = `${min}:${sec}`);
};


export default transformTime;