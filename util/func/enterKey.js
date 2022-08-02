
const enterKey = (event, callback) => {
  if (event.keyCode == 13) {
    callback(event);
  }
}

export default enterKey;