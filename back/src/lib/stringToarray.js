function stringToArr(str) {
  if (str.startsWith("[") && str.endsWith("]")) {
    let arr = str.trim().replace("[", "").replace("]", "").split(",");
    return (arr = arr.map((elm) => elm.trim()));
  }
  throw new Error("변환하고자 하는 문자열의 형식이 배열의 형식이 아닙니다");
}

module.exports = { stringToArr };
