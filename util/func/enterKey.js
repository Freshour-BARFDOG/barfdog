
const enterKey = (event, callback) => {
  if (event.keyCode == 13) {
    callback();
  }
}

export default enterKey;