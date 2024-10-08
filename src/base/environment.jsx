import { Component } from "react";
import { authRequester, apiRequester } from "../services/requester";
import { apiRequesterCMS } from "../services/requester-cms";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import * as Global from "../helpers/global";
import Config from "../config.json";
import { cmsConfig } from "../helpers/cms-config";
import { animateScroll as scroll } from 'react-scroll'


class Environment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...cmsConfig,
            isLoggedIn: false,
            isLoginMenu: false,
            isLoginBox: false,
            isUserMenu: false,
            isShowGoToTop: document.documentElement.scrollTop > 300,
            isB2BLoggedIn: null,
            userInfo: "",
            global: "",
            cmsSettings: "",
            isCMSPortalResponseDone: false,
            isLoadingWebSite: true,
        };
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

    appAuth = () => {
        if (window.location.pathname.toLowerCase() === "/expired") {
            return;
        }
        if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
            var ptoken = localStorage.getItem('ptoken');
            if (ptoken && ptoken.length > 0 && atob(ptoken).toLowerCase() !== window.location.pathname.split('/')[1].toLowerCase()) {
                this.handleLogOut();
                setTimeout('', 3000);
            }
        }
        {
            if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
                localStorage.setItem('ptoken', btoa(window.location.pathname.split('/')[1]))
            }
            if (Config.codebaseType !== undefined &&
                ((Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) === -1)
                    || Config.codebaseType === "tourwiz-tripcenter"
                    || Config.codebaseType === "tourwiz-marketplace"))
                this.getCMSPortalSetting();

            (!localStorage.getItem("portalType") || !localStorage.getItem("environment")) && this.getEnvironment();
            // Config.CMSPortalURL != undefined && 
            // localStorage.getItem("isAllowedCMS") != null &&
            // localStorage.getItem("isAllowedCMS") === "CMS" &&
            //     this.getCMSPortalDetails();
            this.getLoginDetails();
        }
        // authRequester(
        //     function () {
        //         if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
        //             localStorage.setItem('ptoken', btoa(window.location.pathname.split('/')[1]))
        //         }
        //         if (Config.codebaseType !== undefined &&
        //             ((Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) === -1)
        //                 || Config.codebaseType === "tourwiz-tripcenter"
        //                 || Config.codebaseType === "tourwiz-marketplace"))
        //             this.getCMSPortalSetting();

        //         (!localStorage.getItem("portalType") || !localStorage.getItem("environment")) && this.getEnvironment();
        //         // Config.CMSPortalURL != undefined && 
        //         // localStorage.getItem("isAllowedCMS") != null &&
        //         // localStorage.getItem("isAllowedCMS") === "CMS" &&
        //         //     this.getCMSPortalDetails();
        //         this.getLoginDetails();
        //     }.bind(this)
        // );
    };

    getLoginDetails = (callback) => {
        if (localStorage.getItem('environment') === null) {
            return;
        }
        var reqURL = "api/v1/user/details";
        let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
        isPersonateEnabled = isPersonateEnabled === null ? false : isPersonateEnabled;
        var reqOBJ = {
            Request: "",
            Flags: { usecallcenterinfo: isPersonateEnabled },
        };
        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response !== undefined) {
                    this.getAuthToken(data.response, this.getUserPlanRoleDetails);
                }
                else {
                    this.setState({
                        isLoginMenu: true,
                        isB2BLoggedIn: false,
                        isLoadingWebSite: false,
                    });
                }
                if (callback)
                    callback(data);
            }.bind(this)
        );
    };
    getAuthToken = (reqdata, callback) => {
        var reqURL = "api/v1/user/token";
        var reqOBJ = {};
        apiRequester(reqURL, reqOBJ, function (data) {
            localStorage.setItem("userToken", data.response);
            callback(reqdata);
        }.bind(this)
        );
    };

    getUserPlanRoleDetails = (userdetailsresponse) => {
        var reqURL = "tw/plansubscription/role";
        let userinfo = userdetailsresponse;

        apiRequester_unified_api(
            reqURL,
            null,
            (data) => {
                if (data.error) return;
                else {
                    userinfo["rolePermissions"] = data.response;
                    userinfo["iscmsportalcreated"] = data.iscmsportalcreated;
                    userinfo["issendregistrationemail"] = data.issendregistrationemail;
                    userinfo["rolePermissions"]["loggedinuserrole"] = data.employeeadminroledetails;
                    userinfo["isUserAlreadyClockIn"] = data.isUserAlreadyClockIn;
                    userinfo["useralreadyClockindata"] = data.useralreadyClockindata;
                    userinfo["isShowClockIn"] = data.isShowClockIn;
                    userinfo["IsClockedOutForDay"] = data.isClockedOutForDay;
                    userinfo["rolePermissions"]["isFreePlan"] = data.isFreePlan;
                    userinfo["rolePermissions"]["isPlanExpire"] = data.isPlanExpire;
                    userinfo["logggedInUserdetails"] = data.logggedInUserdetails;
                    userinfo["isMaintananceActivityOnTourwiz"] = data.isMaintananceActivityOnTourwiz;
                    //Object.assign(userinfo["rolePermissions"], { loggedinuserrole: [1, 2, 3] });
                    localStorage.setItem("quotaUsage", JSON.stringify({ ...data.accessQuotaDetails, ...data.totalUsedQuotaQueryDetails }));
                    this.setState({
                        isLoginMenu: true,
                        isLoggedIn: true,
                        userInfo: userinfo,
                        isB2BLoggedIn: true,
                        isLoadingWebSite: false,
                    })
                }

            }, 'GET');
    }

    handleLoginBox = (data) => {
        if (data?.continueAsGuest) {
            this.setState({
                isLoginBox: true,
                isLoggedIn: false,
                userInfo: data.response,
            });
        } else {
            (localStorage.getItem("portalType") === "B2B" ||
                localStorage.getItem("portalType") === "BOTH") &&
                this.getEnvironment();
            (data === undefined || !data.response)
                ? this.state.isLoginBox
                    ? this.setState({
                        isLoginBox: false,
                    })
                    : this.setState(
                        {
                            isLoginBox: true,
                        },
                        () => window.scrollTo(0, 0)
                    )
                : this.setState({
                    isLoginBox: false,
                    isLoggedIn: true,
                    userInfo: data.response,
                });
        }
    };

    handleUserMenu = (data) => {
        if (data !== undefined)
            this.setState({
                isUserMenu: false,
            });
        else {
            this.setState({
                isUserMenu: !this.state.isUserMenu,
            });
        }
    };

    handleLogoutExpire = () => {

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
    }

    handleLogOut = () => {
        var reqURL = "api/v1/user/logout";
        var reqOBJ = {
            Request: "",
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
                if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
                    window.location.href = window.location.origin.toLowerCase() + '/' + window.location.pathname.split('/')[1];
                }
                else {
                    window.location.href = window.location.origin;
                }
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

    handleLangChange = () => {
        let currentLang =
            localStorage.getItem("lang") === null
                ? "ar-AE"
                : localStorage.getItem("lang") === "en-US"
                    ? "ar-AE"
                    : "en-US";
        localStorage.setItem("lang", currentLang);
        window.location.reload();
    };

    getEnvironment = () => {
        var reqURL = "api/v1/application/environment";
        var reqOBJ = {
            Request: {},
        };

        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                if (
                    data.response.cobrandDetails.find(
                        (x) => x.shortDesc.toLowerCase() === "isumrahportal".toLowerCase()
                    ) &&
                    data.response.cobrandDetails
                        .find((x) => x.shortDesc.toLowerCase() === "isumrahportal")
                        .value.toLowerCase() === "true"
                )
                    localStorage.setItem("isUmrahPortal", "true");
                //localStorage.setItem("isUmrahPortal", "true");
                localStorage.setItem("portalType", data.response.portalType);
                localStorage.setItem("environment", JSON.stringify(data.response));
                this.setState({
                    global: data.response,
                });
                this.getLoginDetails();
            }.bind(this)
        );
    };

    // getCMSPortalDetails = (callback) => {
    //     var reqURL = `cms/portal/details?siteurl=${Config.CMSPortalURL != undefined ? Config.CMSPortalURL.replace(/^http:\/\//i, '').replace(/^https:\/\//i, '') : ""}`;
    //     let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    //     isPersonateEnabled =
    //     isPersonateEnabled === null ? false : isPersonateEnabled;
    //     var reqOBJ = {
    //     Request: "",
    //     Flags: { usecallcenterinfo: isPersonateEnabled },
    //     };
    //     apiRequesterCMS(
    //     reqURL,
    //     reqOBJ,
    //     (data) => {
    //         console.log(JSON.stringify(data.response[0]));
    //         if (data.error) {
    //             data.response = [];
    //         }
    //         if (data.response.length > 0) {
    //             localStorage.setItem(
    //             "CMSPortalDetails",
    //             JSON.stringify(data.response[0])
    //             );
    //             localStorage.setItem("cmsPortalID", data.response[0].portalID)
    //         }
    //     },
    //     "GET"
    //     );
    // };



    postMessage(message) {
        (window.parent ?? window).postMessage(message, "*");
    }

    getCMSPortalSetting = () => {
        let reqOBJ = {};

        let reqURL = "cms/portal/details?" + this.state.siteurl;
        apiRequesterCMS(
            reqURL,
            reqOBJ,
            (data) => {
                var res = data?.response;
                res[0] && res[0]?.portalID > 0 ? (document.title = data?.response && data?.response[0].webSiteTitle) : (document.title = "With reference to your recent inquiry with us, please click on the link above to find detailed information about your holiday plan.");
                res[0] && res[0]?.portalID > 0 ? (document.querySelector('meta[name="description"]').setAttribute("content", data?.response && data?.response[0].webSiteTitle)) : (document.querySelector('meta[name="description"]').setAttribute("content", "With reference to your recent inquiry with us, please click on the link above to find detailed information about your holiday plan."));
                this.setState({
                    cmsSettings: (data?.response && data?.response[0]) || "",
                    isCMSPortalResponseDone: true,
                    cmsContents: data
                });
            },
            "GET"
        );
    };

    getCountry = () => {
        return fetch("https://geolocation-db.com/json/")
            .then((res) => res.json())
            .then((data) => {
                const currentCurrency = data?.country_name?.toLowerCase() === "india" ? "INR" : "USD";
                const currentCountry = data?.country_name?.toLowerCase() !== "india" ? data?.country_name : "india";
                this.setState({
                    ipCurrencyCode: currentCurrency,
                    ipCountryName: currentCountry
                });
            }).catch((err) => {
                this.setState({
                    ipCurrencyCode: "INR"
                });
            });
    };

    componentDidMount() {
        this.getCountry();
        if (process.env.NODE_ENV === "development") {
            window.setInterval(() => {
                document.querySelectorAll('iframe').forEach(elem => {
                    if (elem.attributes["src"] === undefined || !elem.attributes["src"].value.startsWith("https://www.google.com/recaptcha/api2/")) {
                        elem.parentNode.removeChild(elem);
                    }
                });
            }, 3000);
        }
        if (window.location.pathname !== '/Template1'
            && window.location.pathname !== '/Template2'
            && window.location.pathname !== '/Template3'
            && window.location.pathname !== '/Template4')
            this.appAuth();
        // if (localStorage.getItem('environment'))
        //     this.getLoginDetails();

        this.postMessage(window.location.href.toString());
        window.addEventListener("hashchange", () => this.postMessage(window.location.href.toString()));
        window.addEventListener('scroll', this.toggleVisible);
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
}

export default Environment;
