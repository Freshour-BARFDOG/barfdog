const convertFileSizeToMegabyte = (filesize) => {
  const size = filesize / 1000000;
  return size;
};

export default convertFileSizeToMegabyte;