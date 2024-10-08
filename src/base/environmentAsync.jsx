import { Component } from "react";
import { authRequester, apiRequester } from "../services/requester";
import { apiRequesterCMS } from "../services/requester-cms";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import * as Global from "../helpers/global";
import Config from "../config.json";
import { cmsConfig } from "../helpers/cms-config";
import { animateScroll as scroll } from 'react-scroll'
import { Trans } from "../helpers/translate";

class EnvironmentAsync extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...cmsConfig,
            ipCurrencyCode: 'INR',
            ipCountryName: '',
            cmsSettings: null,
            isCMSPortalResponseDone: false,
            cmsContents: null,
            global: null,
            isLoginMenu: false,
            isB2BLoggedIn: false,
            isLoadingWebSite: true,
            userInfo: '',
        };
    }

    async componentDidMount() {
        let stateObject = {}
        //Call API - Get user country
        this.getCountry();
        this.removeIFrame();
        this.postMessage(window.location.href.toString());
        window.addEventListener("hashchange", () => this.postMessage(window.location.href.toString()));
        window.addEventListener('scroll', this.toggleVisible);

        if (window.location.pathname !== '/Template1' && window.location.pathname !== '/Template2'
            && window.location.pathname !== '/Template3' && window.location.pathname !== '/Template4') {

            if (window.location.pathname.toLowerCase() === "/expired") {
                return;
            }
            if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
                var ptoken = localStorage.getItem('ptoken'); //Micro website(B2C) Related chagnes
                if (ptoken && ptoken.length > 0 && atob(ptoken) !== window.location.pathname.split('/')[1]) {
                    await this.performLogOut();
                    await this.handleLogOutCallback();
                    return;
                }
            }

            //Call API - App Auth
            await this.appAuth();
            var promises = [];
            var cmsAPIResponse = null;
            if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
                localStorage.setItem('ptoken', btoa(window.location.pathname.split('/')[1])); //Micro website(B2C) Related chagnes
            }
            if (Config.codebaseType !== undefined &&
                ((Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) === -1)
                    || Config.codebaseType === "tourwiz-tripcenter"
                    || Config.codebaseType === "tourwiz-marketplace")) {
                //Call API - CMS Portal Settings
                //promises.push({ key: 'cmsAPIResponse', value: this.getCMSPortalSetting() });
            }

            //TO stop Parallel call comment/delete below if and else, then uncomment API call statement from below code blocks
            //Parallel call STARTS

            var roleResponse = null;
            const keyValuePairs = {};

            // promises.push({ key: 'userinfo', value: this.getLoginDetails() });
            // promises.push({ key: 'authData', value: this.getAuthToken() });

            // if (!localStorage.getItem("portalType") || !localStorage.getItem("environment")) {
            //     promises.push({ key: 'environmentResponse', value: this.getEnvironment() });
            // }
            await Promise.all(promises.map(obj => obj.value))
                .then(results => {
                    results.forEach((result, index) => {
                        const { key } = promises[index];
                        keyValuePairs[key] = result;
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            //Parallel call ENDS
            if (keyValuePairs["cmsAPIResponse"]) {
                cmsAPIResponse = keyValuePairs["cmsAPIResponse"];
                let cmsResponse = cmsAPIResponse?.response;
                if (cmsResponse[0] && cmsResponse[0]?.portalID > 0) {
                    document.title = cmsResponse && cmsResponse[0].webSiteTitle;
                    document.querySelector('meta[name="description"]').setAttribute("content", cmsResponse && cmsResponse[0].webSiteTitle);
                }
                else {
                    document.title = "With reference to your recent inquiry with us, please click on the link above to find detailed information about your holiday plan.";
                    document.querySelector('meta[name="description"]').setAttribute("content", "With reference to your recent inquiry with us, please click on the link above to find detailed information about your holiday plan.");
                }
                stateObject = {
                    ...stateObject,
                    cmsSettings: (cmsResponse && cmsResponse[0]) || "",
                    isCMSPortalResponseDone: true,
                    cmsContents: cmsAPIResponse
                };
            }
            //Process "Get Environment" response
            //if (!localStorage.getItem("portalType") || !localStorage.getItem("environment")) {
            if (keyValuePairs["environmentResponse"]) {
                var environmentResponse = keyValuePairs["environmentResponse"];
                //Call API - Get Environment
                //const environmentResponse = await this.getEnvironment();
                if (environmentResponse.response.cobrandDetails.find((x) => x.shortDesc.toLowerCase() === "isumrahportal")?.value.toLowerCase() === "true")
                    localStorage.setItem("isUmrahPortal", "true");

                localStorage.setItem("portalType", environmentResponse.response.portalType);
                localStorage.setItem("environment", JSON.stringify(environmentResponse.response));
                stateObject = { ...stateObject, global: environmentResponse.response };
            }

            //Process "Get Login Details" response
            if (localStorage.getItem('environment')) {
                var userinfo = keyValuePairs["userinfo"];
                //Call API - Get Login Details
                //const userinfo = await this.getLoginDetails();
                if (userinfo && userinfo.response !== undefined) {
                    userinfo = userinfo.response;
                    //Call API - Get Auth Token
                    //await this.getAuthToken();
                    //let roleResponse = await this.getUserPlanRoleDetails();
                    roleResponse = await this.getUserPlanRoleDetails();
                    if (roleResponse.error) {
                        this.setState({
                            isButtonLoding: false,
                            isValidCaptcha: true,
                            errorMessage: Trans("_incorrectUserNamePassword"),
                        });
                    }
                    else {
                        userinfo["rolePermissions"] = roleResponse.response;
                        userinfo["iscmsportalcreated"] = roleResponse.iscmsportalcreated;
                        userinfo["issendregistrationemail"] = roleResponse.issendregistrationemail;
                        userinfo["rolePermissions"]["loggedinuserrole"] = roleResponse.employeeadminroledetails;
                        userinfo["isUserAlreadyClockIn"] = roleResponse.isUserAlreadyClockIn;
                        userinfo["useralreadyClockindata"] = roleResponse.useralreadyClockindata;
                        userinfo["isShowClockIn"] = roleResponse.isShowClockIn;
                        userinfo["IsClockedOutForDay"] = roleResponse.isClockedOutForDay;
                        userinfo["rolePermissions"]["isFreePlan"] = roleResponse.isFreePlan;
                        userinfo["rolePermissions"]["isPlanExpire"] = roleResponse.isPlanExpire;
                        userinfo["logggedInUserdetails"] = roleResponse.logggedInUserdetails;
                        userinfo["isMaintananceActivityOnTourwiz"] = roleResponse.isMaintananceActivityOnTourwiz;
                        //Object.assign(userinfo["rolePermissions"], { loggedinuserrole: [1, 2, 3] });
                        localStorage.setItem("quotaUsage", JSON.stringify({ ...roleResponse.accessQuotaDetails, ...roleResponse.totalUsedQuotaQueryDetails }));
                        this.setState({
                            isLoginMenu: true,
                            isLoggedIn: true,
                            userInfo: userinfo,
                            isB2BLoggedIn: true,
                            isLoadingWebSite: false,
                        });
                    }
                }
                else {
                    stateObject = {
                        ...stateObject,
                        isLoginMenu: true,
                        isB2BLoggedIn: false,
                        isLoadingWebSite: false,
                    };
                }
            }
            else {
                stateObject = {
                    ...stateObject,
                    isLoginMenu: true,
                    isB2BLoggedIn: false,
                    isLoadingWebSite: false,
                };
            }
        }
        //Save all state data at single cycle
        this.setState({ ...stateObject });
    }

    componentDidUpdate() {
        let environment = JSON.parse(localStorage.getItem("environment"));
        if (environment?.portalName) {
            if (window.location.pathname.indexOf("hajj") === -1 &&
                window.location.pathname.indexOf("assistant") === -1 &&
                window.location.pathname.indexOf("signin") === -1 &&
                window.location.pathname.indexOf("signup") === -1 &&
                window.location.pathname.indexOf("thankyou") === -1) {
                document.title = this.state.cmsSettings ? this.state.cmsSettings.webSiteTitle
                    : environment?.portalName;
            }
            const favicon = document.getElementById("favicon");
            var hrefFavicon = this.state.cmsSettings
                ? process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
                this.state.cmsSettings.portalID + "/favicon.ico"
                : (environment?.portalLogo);
            if (favicon) favicon.href = hrefFavicon;
            // if (favicon)
            //     favicon.href = environment?.portalLogo;
        }
    }

    postMessage(message) {
        (window.parent ?? window).postMessage(message, "*");
    }

    scrollToTop = () => {
        scroll.scrollToTop();
    }
    toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (document.getElementsByClassName("goToTopButton").length > 0) {
            if (scrolled > 300) {
                document.getElementsByClassName("goToTopButton")[0].style.display = 'block';
            }
            else if (scrolled <= 300) {
                document.getElementsByClassName("goToTopButton")[0].style.display = 'none';
            }
        }
    }

    getCountry = async () => {
        if (localStorage.getItem('country-manual')) {
            this.setState({
                ipCurrencyCode: 'USD',
                ipCountryName: localStorage.getItem('country-manual')
            });
            return new Promise(function (resolve, reject) { resolve() });
        }
        return fetch("https://geolocation-db.com/json/")
            .then((res) => res.json())
            .then((data) => {
                const currentCurrency = data?.country_name?.toLowerCase() === "india" ? "INR" : "USD";
                const currentCountry = data?.country_name?.toLowerCase() !== "india" ? data?.country_name : "india";
                this.setState({
                    ipCurrencyCode: currentCurrency,
                    ipCountryName: currentCountry
                });
            })
            .catch((error) => console.error(error));
    };

    removeIFrame = () => {
        if (process.env.NODE_ENV === "development") {
            window.setInterval(() => {
                document.querySelectorAll('iframe').forEach(elem => {
                    if (elem.attributes["src"] === undefined || !elem.attributes["src"].value.startsWith("https://www.google.com/recaptcha/api2/")) {
                        elem.parentNode.removeChild(elem);
                    }
                });
            }, 3000);
        }
    }

    handleLogOut = async () => {
        await this.performLogOut();
        await this.handleLogOutCallback();
    };

    performLogOut = async () => {
        var reqURL = "api/v1/user/logout";
        var reqOBJ = {
            Request: "",
        };
        return new Promise(function (resolve, reject) {
            apiRequester(
                reqURL,
                reqOBJ,
                function (data) {
                    resolve();
                }.bind(this)
            );
        });
    };

    handleLogOutCallback = async () => {
        await this.ClearLocalStorage();
        if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
            window.location.href = window.location.origin.toLowerCase() + '/' + window.location.pathname.split('/')[1];
        }
        else {
            window.location.href = window.location.origin;
        }
    }

    ClearLocalStorage = async () => {
        sessionStorage.removeItem("personateId");
        sessionStorage.removeItem("callCenterType");
        sessionStorage.removeItem("bookingFor");
        sessionStorage.removeItem("bookingForInfo");
        localStorage.removeItem("personateId");
        localStorage.removeItem("cartLocalId");
        localStorage.removeItem("afUserType");
        localStorage.removeItem("environment");
        localStorage.removeItem("userToken");
        localStorage.removeItem("agentName");
        localStorage.removeItem("quotaUsage");
        localStorage.removeItem("showTaxConfigurationPopup");
        localStorage.removeItem("ptoken");
        localStorage.removeItem("customer-info");
        localStorage.removeItem("customHomeURL");
        localStorage.removeItem("quotationDetails");
        localStorage.removeItem("portalType");
        localStorage.removeItem("quotationItems");
        localStorage.removeItem("isCMSPortalCreated");
        localStorage.removeItem("lang");
        localStorage.removeItem("country-manual");
        //return new Promise(function (resolve, reject) { resolve() });
    }

    appAuth = async () => {
        return new Promise(function (resolve, reject) {
            resolve();// authRequester(function () { resolve() });
        });
    }

    getCMSPortalSetting = async () => {
        let reqOBJ = {};
        let reqURL = "cms/portal/details?" + this.state.siteurl;

        return new Promise(function (resolve, reject) {
            apiRequesterCMS(reqURL, reqOBJ, (data) => {
                resolve(data);
            },
                "GET"
            );
        });
    };

    getEnvironment = async () => {
        var reqURL = "api/v1/application/environment";
        var reqOBJ = {
            Request: {},
        };

        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, function (data) {
                resolve(data);
            }.bind(this)
            );
        });
    };

    getLoginDetails = async () => {
        var reqURL = "api/v1/user/details";
        let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
        isPersonateEnabled = isPersonateEnabled === null ? false : isPersonateEnabled;
        var reqOBJ = {
            Request: "",
            Flags: { usecallcenterinfo: isPersonateEnabled },
        };
        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, function (data) {
                resolve(data);
            }.bind(this)
            );
        });
    };

    getAuthToken = async () => {
        var reqURL = "api/v1/user/token";
        var reqOBJ = {};
        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, function (data) {
                if (data?.response)
                    localStorage.setItem("userToken", data.response);
                else
                    localStorage.removeItem("userToken");
                resolve();
            }.bind(this)
            );
        });
    };

    handleLoginBox = async (data) => {
        if (data?.continueAsGuest) {
            return {
                isLoginBox: true,
                isLoggedIn: false,
                userInfo: data.response,
            };
        } else {
            /* (localStorage.getItem("portalType") === "B2B" ||
                localStorage.getItem("portalType") === "BOTH") &&
                this.getEnvironment(); */
            window.scrollTo(0, 0);
            return (data === undefined || !data.response)
                ? this.state.isLoginBox
                    ? { isLoginBox: false, }
                    : { isLoginBox: true, }
                : { isLoginBox: false, isLoggedIn: true, userInfo: data.response, };
        }
    };

    handleTourwizLogin = async () => {
        let stateObject = {}
        //let userinfo = await this.getLoginDetails();
        //await this.getAuthToken();
        // let [userinfo, authData, environmentResponse, portalsResponse] = await Promise.all([
        //     this.getLoginDetails(),
        //     this.getAuthToken(),
        //     this.getEnvironment(),
        //     this.getPortals()
        // ]);
        // userinfo = userinfo.response;
        // if (localStorage.getItem("afUserType") === null) {
        //     localStorage.setItem("afUserType", userinfo.afUserType);
        // }
        // if (environmentResponse) {
        //     //Call API - Get Environment
        //     //const environmentResponse = await this.getEnvironment();
        //     if (environmentResponse.response.cobrandDetails.find((x) => x.shortDesc.toLowerCase() === "isumrahportal")?.value.toLowerCase() === "true")
        //         localStorage.setItem("isUmrahPortal", "true");

        //     localStorage.setItem("portalType", environmentResponse.response.portalType);
        //     localStorage.setItem("environment", JSON.stringify(environmentResponse.response));
        //     stateObject = { ...stateObject, global: environmentResponse.response };
        // }
        // let personateRequest = null;
        // if (portalsResponse) {

        //     if (portalsResponse.status.code === 41070) {
        //         //Do nothing
        //     } else {
        //         let portals = portalsResponse.response;
        //         let portalId = sessionStorage.getItem("portalId")
        //             ? sessionStorage.getItem("portalId")
        //             : portalsResponse.response[0].id;
        //         let personateId = portalId
        //             ? portals.find((x) => x.id === portalId).defaultPersonateId
        //             : portals[0].defaultPersonateId;

        //         personateRequest = {
        //             id: personateId,
        //             details: { firstName: "" },
        //         };
        //     }
        // }
        // let [personateResponse, roleResponse] = await Promise.all([
        //     this.setPersonate(personateRequest),
        //     this.getUserPlanRoleDetails()
        // ]);
        // if (personateResponse) {
        //     sessionStorage.setItem("personateId", personateRequest.id);
        //     sessionStorage.setItem("callCenterType", personateRequest.type);
        //     sessionStorage.setItem("bookingFor", personateRequest.details.firstName);
        //     sessionStorage.setItem("bookingForInfo", JSON.stringify(personateRequest.details));
        //     localStorage.setItem("personateId", personateRequest.id);
        //     localStorage.setItem("environment", JSON.stringify(personateResponse.response));
        //     localStorage.removeItem("cartLocalId");
        // }
        // if (roleResponse.error) {
        //     this.setState({
        //         ...stateObject,
        //         isButtonLoding: false,
        //         isValidCaptcha: true,
        //         errorMessage: Trans("_incorrectUserNamePassword"),
        //     });
        //     return new Promise(function (resolve, reject) { resolve("error") });
        // }
        // else {
        //     userinfo["rolePermissions"] = roleResponse.response;
        //     userinfo["iscmsportalcreated"] = roleResponse.iscmsportalcreated;
        //     userinfo["issendregistrationemail"] = roleResponse.issendregistrationemail;
        //     userinfo["rolePermissions"]["loggedinuserrole"] = roleResponse.employeeadminroledetails;
        //     userinfo["isUserAlreadyClockIn"] = roleResponse.isUserAlreadyClockIn;
        //     userinfo["useralreadyClockindata"] = roleResponse.useralreadyClockindata;
        //     userinfo["isShowClockIn"] = roleResponse.isShowClockIn;
        //     userinfo["IsClockedOutForDay"] = roleResponse.isClockedOutForDay;
        //     userinfo["rolePermissions"]["isFreePlan"] = roleResponse.isFreePlan;
        //     userinfo["rolePermissions"]["isPlanExpire"] = roleResponse.isPlanExpire;
        //     userinfo["logggedInUserdetails"] = roleResponse.logggedInUserdetails;
        //     userinfo["isMaintananceActivityOnTourwiz"] = roleResponse.isMaintananceActivityOnTourwiz;
        //     //Object.assign(userinfo["rolePermissions"], { loggedinuserrole: [1, 2, 3] });
        //     localStorage.setItem("quotaUsage", JSON.stringify({ ...roleResponse.accessQuotaDetails, ...roleResponse.totalUsedQuotaQueryDetails }));
        //     this.setState({
        //         ...stateObject,
        //         isLoginMenu: true,
        //         isLoggedIn: true,
        //         userInfo: userinfo,
        //         isB2BLoggedIn: true,
        //         isLoadingWebSite: false,
        //     });
        //     return new Promise(function (resolve, reject) { resolve("success") });
        // }
    }

    getUserPlanRoleDetails = async (userdetailsresponse) => {
        var reqURL = "tw/plansubscription/role";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                null,
                (data) => {
                    resolve(data);
                }, 'GET');
        });
    }

    getPortals = async () => {
        let reqURL = "api/v1/callcenter/portals";
        let reqOBJ = {
            Request: "",
        };
        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, (data) => {
                resolve(data);
            });
        });
    };

    setPersonate = async (req) => {
        if (req === null)
            return new Promise(function (resolve, reject) { resolve() });

        let reqURL = "api/v1/callcenter/setpersonate";
        let reqOBJ = {
            Request: req.id,
        };
        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, (data) => {
                resolve(data);
            });
        });
    };

    handleLogOutAfterChangePassword = () => {
        var reqURL = "api/v1/user/logout";
        var reqOBJ = {
            Request: "",
            IsFromChangePassword: true
        };

        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                sessionStorage.removeItem("personateId");
                sessionStorage.removeItem("callCenterType");
                sessionStorage.removeItem("bookingFor");
                sessionStorage.removeItem("bookingForInfo");
                localStorage.removeItem("personateId");
                localStorage.removeItem("cartLocalId");
                localStorage.removeItem("afUserType");
                localStorage.removeItem("environment");
                localStorage.removeItem("userToken");
                localStorage.removeItem("agentName");
                localStorage.removeItem("quotaUsage");
                localStorage.removeItem("showTaxConfigurationPopup");
                localStorage.removeItem("ptoken");
                localStorage.removeItem("customer-info");
                localStorage.removeItem("customHomeURL");
                localStorage.removeItem("quotationDetails");
                localStorage.removeItem("portalType");
                localStorage.removeItem("quotationItems");
                localStorage.removeItem("isCMSPortalCreated");
                localStorage.removeItem("lang");
                localStorage.removeItem("country-manual");
                window.location.href = window.location.origin;
                /*this.setState({
                   isLoggedIn: false,
                   isUserMenu: false,
                   isB2BLoggedIn: false,
                   userInfo: "",
               });*/
                //if (Global.getEnvironmetKeyValue("portalType") === 'B2C')
            }.bind(this)
        );
    };

}
export default EnvironmentAsync;
//return new Promise(function (resolve, reject) { resolve() });