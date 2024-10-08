import * as Global from "./global";

let specialCharData = Global.specialCharData;

//to flip array
const objectFlip = obj => {
  return Object.entries(obj).reduce((ret, entry) => {
    const [key, value] = entry;
    ret[value] = key;
    return ret;
  }, {});
};

const getResult = (text, isReverseMode) => {
  let tmp_specialCharData = specialCharData;
  if (isReverseMode) {
    tmp_specialCharData = objectFlip(tmp_specialCharData);
  }
  var returnString = text;
  Object.keys(tmp_specialCharData).map(item => {
    returnString = replaceAll(returnString, item, tmp_specialCharData[item]);
    return true;
  });
  return returnString;
};

const replaceAll = (str, term, replacement) => {
  return str.replace(new RegExp(escapeRegExp(term), "g"), replacement);
};

const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

//**************
//Export methods
//**************
export const encodeSpecialChars = text => {
  return getResult(text, false);
};

export const decodeSpecialChars = (text, isReverseMode) => {
  return getResult(text, true);
};

export const getDecodeKeyValue = text => {
  if (Object.keys(specialCharData).find(x => x === text) !== undefined)
    return specialCharData[text];
  else return text;
};
