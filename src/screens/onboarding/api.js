import * as encrypt from "../../helpers/encrypto";
import { getLocalhostUrlFromEndPoints } from "../../services/get-localhost-url-from-end-points";

const executeApi = async (method, url, body) => {

    let headers = {
        "Content-Type": "application/json"
    };
    let apiUrl = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/tw/";
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
        apiUrl = getLocalhostUrlFromEndPoints(url) + "/";
    }
    apiUrl = (apiUrl + url).replace('://', '`').replace('//', '/').replace('`', '://');
    const response = await fetch(apiUrl, {
        method: method.toUpperCase(),
        headers: headers,
        body: (body) ? JSON.stringify(body) : null
    })

    let bodyText = await response.text();

    if (response.status !== 200) {
        let res = null;
        try {
            res = JSON.parse(bodyText);
        } catch (e) {
            res = bodyText;
        }
        throw res;
    }

    try {
        return JSON.parse(bodyText);
    } catch (e) {
        if (bodyText === undefined || bodyText.trim() === "") {
            return "";
        }
        throw bodyText;
    }
}

export const global = {
    introduction: {},
    customization: {},
    login: {},
    reset: () => {
        global.introduction = {};
        global.customization = {};
        global.login = {};
    }
};

export const TourwizApi = {
    queryLocations: async (query) => {
        return await executeApi('GET', `lookup/city?q=${query}`)
    },
    queryTimezone: async (query) => {
        return await executeApi('GET', 'lookup/timezone')
    },
    queryCurrencies: async () => {
        return await executeApi('GET', 'lookup/currency')
    },
    validateEmail: async (email) => {
        return await executeApi('POST', 'validate/email', {
            key: email
        })
    },
    validateDomain: async (domain) => {
        return await executeApi('POST', 'validate/domain', {
            key: domain
        })
    },
    login: async (id, password) => {
        return await executeApi('POST', 'login', {
            id: id,
            password: password
        })
    },
    sendPasswordOtp: async (id, captchaToken, isFromB2CPortal) => {
        return await executeApi('POST', 'forgotpassword/otp', {
            id: encrypt.encryptUsingAES256(id),
            CaptchaToken: captchaToken,
            isFromB2CPortal: isFromB2CPortal,
            url: (isFromB2CPortal ? window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) : "")
        })
    },
    forgotPassword: async (id, password, otp, isFromB2CPortal) => {
        return await executeApi('POST', 'forgotpassword', {
            id: encrypt.encryptUsingAES256(id),
            password: encrypt.encryptUsingAES256(password),
            otp: encrypt.encryptUsingAES256(otp),
            isFromB2CPortal: isFromB2CPortal,
            url: (isFromB2CPortal ? window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) : "")
        })
    },
    setup: async (signupData, requestOtp = false) => {
        return await executeApi('POST', `setup${requestOtp ? '/otp' : ''}`, {
            firstName: signupData.login.firstName,
            lastName: signupData.login.lastName,
            companyName: signupData.introduction.businessName,
            branchName: signupData.introduction.location.name,
            companyDescription: signupData.introduction.businessName,
            address1: signupData.introduction.address,
            customerCareEmail: signupData.login.email,
            loginName: signupData.login.email,
            cityId: signupData.introduction.location.cityId,
            stateId: signupData.introduction.location.stateId,
            countryId: signupData.introduction.location.countryId,
            postalCode: signupData.introduction.postalCode,
            phoneNumber: signupData.introduction.supportPhoneNumber,
            zoneName: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
            currencySymbol: signupData.customization.currency,
            password: signupData.login.password,
            displayName: `${signupData.login.firstName} ${signupData.login.lastName}`,
            identificationCode: signupData.login.email,
            domain: signupData.customization.domain,
            logo: (signupData.customization.logo && signupData.customization.logo?.data) ? {
                ...signupData.customization.logo,
                name: "logo"
            } : null,
            otp: signupData.login.otp
        });
    }
}
