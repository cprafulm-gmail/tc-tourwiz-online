import * as CryptoJS from 'crypto-js';

function NotImplementedError(message = "") {
  this.name = "NotImplementedError";
  this.message = message;
}
NotImplementedError.prototype = Error.prototype;

export const encryptUsingAES256 = (encString) => {
  if (process.env.REACT_APP_AES_ENCRYPTION_KEY === undefined) {
    throw new NotImplementedError("Encryption Key Missing");
  }
  //var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify("Your Json Object data or string")), this.key, {
  var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encString), CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_ENCRYPTION_KEY), {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_ENCRYPTION_Iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // decryptUsingAES256(encrypted)
  return encrypted.toString();
}

export const decryptUsingAES256 = (decString) => {
  if (process.env.REACT_APP_AES_ENCRYPTION_KEY === undefined) {
    throw new NotImplementedError("Encryption Key Missing");
  }
  var decrypted = CryptoJS.AES.decrypt(decString, CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_ENCRYPTION_KEY), {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_ENCRYPTION_Iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);

}