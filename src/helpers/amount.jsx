import * as Global from "./global";

const Amount = ({ amount, currencySymbol, currencyCode }) => {
  let getCurrencySymbol = (currencySymbol, currencyCode) => {
    let availableCurrencies = Global.getEnvironmetKeyValue("availableCurrencies");
    let returnValue = "";
    if (
      currencyCode !== undefined &&
      currencyCode !== "" &&
      availableCurrencies.filter((x) => x.isoCode === currencyCode).length > 0
    )
      returnValue = availableCurrencies.filter((x) => x.isoCode === currencyCode)[0].symbol;
    if (!returnValue && currencySymbol) returnValue = currencySymbol;
    if (!returnValue && !currencySymbol)
      returnValue = Global.getEnvironmetKeyValue("portalCurrencySymbol");
    return returnValue;
  };

  const currencyFormat = (num, currencySymbol, currencyCode) => {
    if (isNaN(Number(num))) return "";
    let output = currencyFormatUS(num, currencySymbol, currencyCode);
    output = Global.getEnvironmetKeyValue("isCurrencyPrefix")
      ? getCurrencySymbol(currencySymbol, currencyCode) + " " + output
      : output + " " + getCurrencySymbol(currencySymbol, currencyCode);
    return output;
  };

  const currencyFormatUS = (num, currencySymbol, currencyCode) => {
    let strNumber = "";
    if (Global.getEnvironmetKeyValue("isRoundOff")) strNumber = Number(num).toString();
    else strNumber = Number.parseFloat(Number(num)).toFixed(2);
    return strNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const currencyFormatIN = (num, currencySymbol, currencyCode) => {
    return num
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const currencyFormatDE = (num, currencySymbol, currencyCode) => {
    return num
      .toFixed(2) // always two decimal digits
      .replace(".", ",") // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); //+ ' €' // use . as a separator
  };

  return currencyFormat(amount, currencySymbol, currencyCode);
};

export default Amount;
