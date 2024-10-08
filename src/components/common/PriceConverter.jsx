import * as Global from "../../helpers/global";

const PriceConverter = ({ amount, currentCurrency = "INR" }) => {
    const convertCurrency = (amount, conversionFactor, conversionCode, toBeConvertedFactor, toBeCurrencyCode) => {
        return Math.round(Math.round((amount / conversionFactor) * toBeConvertedFactor * 100) / 100);
    };

    let availableCurrencies = Global.getEnvironmetKeyValue("availableCurrencies");
    let toBeConvert = availableCurrencies.find((x) => x.isoCode === currentCurrency);
    let packageCurrency = availableCurrencies.find((x) => x.isoCode === "INR");
    const [packagePrice, currentCurrencyCode] = [convertCurrency(amount, packageCurrency.factor, packageCurrency.isoCode, toBeConvert.factor, toBeConvert.isoCode), currentCurrency];

    return [packagePrice, currentCurrencyCode];
}

export default PriceConverter;
