const setExpiryDate = (date = 7) => {
  const now = new Date();
  const dateTime = 1000 * 60 * 60 * 24;
  const expiryDate = new Date(now.setDate(now.getDate() + date)).toString();
  return expiryDate
}

export  default setExpiryDate;