

function randomNumbers(stringMaxLength) {
  const chars = "0123456789";
  const strLength = stringMaxLength || 6;
  let randomstring = "";
  for (let i = 0; i < strLength; i++) {
    const randomNum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(randomNum, randomNum + 1);
  }
  return randomstring;
}

export default randomNumbers;
