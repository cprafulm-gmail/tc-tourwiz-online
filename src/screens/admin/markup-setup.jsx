import SVGIcon from "../../helpers/svg-icon";
import React, { useEffect, useState, useCallback } from 'react';
import { Trans } from "../../helpers/translate";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import QuotationMenu from "../../components/quotation/quotation-menu";
import MessageBar from '../../components/admin/message-bar';
import ModelPopup from "../../helpers/model";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

const MarkupSetup = (props) => {

    const [activityServiceProviders, setActivityServiceProviders] = useState([]);
    const [markupData, setMarkupData] = useState([]);
    const [editBusiness, setEditBusiness] = useState('hotel');
    const [mode, setMode] = useState('percentage');
    const [configurationValue, setconfigurationValue] = useState(0);
    const [editJSONData, setEditJSONData] = useState(null);
    const [errorConfigurationValue, setErrorConfigurationValue] = useState('');
    const [postStatus, setPostStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isShowConfirmMessage, setIsShowConfirmMessage] = useState(false);
    const [isshowauthorizepopup, setIsShowAuthorizePopup] = useState(false);

    useEffect(() => {
        getMarkupData();
        getServiceProviders();
    }, [])

    const getServiceProviders = () => {
        let reqURL = "admin/lookup/serviceprovidercode?businesstype=Activity";

        apiRequester_unified_api(
            reqURL,
            null,
            (data) => {
                if (data.error) {
                    data.response = [];
                }
                let providers = data.response.map(x => x.serviceProviderCode).map(x => x.toLowerCase().indexOf("manual") > -1 ? false : x).filter(Boolean)
                setActivityServiceProviders(providers);
            }, "GET")
    }
    const getMarkupData = () => {
        resetData();
        setIsLoading(true);
        let reqURL = "admin/markupsetup/publish/list";

        apiRequester_unified_api(
            reqURL,
            null,
            (data) => {
                if (data.error) {
                    data.response = [];
                }
                else {
                    data.response = data.response.filter(x => x.publishStatus === 16);
                    const environment = JSON.parse(localStorage.getItem("environment"));
                    let business = Object.keys(environment.availableBusinesses);
                    business = business.filter(x => x === "hotel" || x === "air" || x === "activity");
                    let markupDataObj = business.map(item => {
                        let id = parseInt(environment.availableBusinesses[item].id);
                        let responseData = data.response
                        let filteredResponseData = responseData.find(x => parseInt(x.businessTypeID) === id);
                        if (filteredResponseData) {
                            let markupData = {
                                commissionDetailID: filteredResponseData.commissionDetailID,
                                businessName: item,
                                businessID: id,
                                commissionTypeID: filteredResponseData.commissionTypeID,
                                value: filteredResponseData.defaultValue,
                                exceptionCount: filteredResponseData.exceptionCount,
                                CommissionExceptionID: null,
                                jsonData: filteredResponseData
                            };
                            return markupData;
                        }
                        else {
                            let markupData = {
                                commissionDetailID: 0,
                                businessName: item,
                                businessID: parseInt(environment.availableBusinesses[item].aliasId ?? environment.availableBusinesses[item].id),
                                commissionTypeID: 9,
                                value: '0.0 %',
                                exceptionCount: 0,
                                CommissionExceptionID: null,
                                jsonData: null
                            };
                            return markupData;
                        }
                    });
                    //setMarkupData(markupDataObj);

                    getMarkupExceptionData(markupDataObj);
                }
            },
            "GET"
        );
    }

    const addPendingbusiness = (markupDataObj) => {
        const environment = JSON.parse(localStorage.getItem("environment"));
        let business = Object.keys(environment.availableBusinesses);
        business.map(item => {
            if (markupDataObj.find(x => x.businessName === item))
                return false;

            let markupData = {
                commissionDetailID: 0,
                businessName: item,
                businessID: parseInt(environment.availableBusinesses[item].aliasId),
                commissionTypeID: 9,
                value: '0.0 %',
                exceptionCount: 0,
                CommissionExceptionID: null,
                jsonData: null
            };
            markupDataObj.push(markupData);
        })
        markupDataObj = markupDataObj.sort((a, b) => a.businessID - b.businessID);
    }

    const getMarkupExceptionData = (markupDataObj) => {
        let commissionDetailID = markupDataObj.find(x => x.businessID === 5)?.commissionDetailID ?? 0;
        if (commissionDetailID === 0) {
            addPendingbusiness(markupDataObj);
            setMarkupData(markupDataObj);

            setIsLoading(false);
            return;
        }
        let reqURL = "admin/markupsetup/exception/list?commissiondetailid=" + commissionDetailID;

        apiRequester_unified_api(
            reqURL,
            null,
            (data) => {
                if (data.error) {
                    data.response = [];
                }
                else {
                    //data.response = data.response.filter(x => x.publishStatus === 16);

                    data.response.map(item => {
                        let businessName = getBusinessNameAndId(item.serviceProviderCode ?? "transfers", "name");
                        let businessID = getBusinessNameAndId(item.serviceProviderCode ?? "transfers", "id");

                        let markupData = {
                            commissionDetailID: item.commissionDetailID,
                            businessName: businessName,
                            businessID: businessID,
                            commissionTypeID: 9,
                            value: item.commissionAmount,
                            exceptionCount: 0,
                            CommissionExceptionID: item.commissionExceptionID,
                            jsonData: item
                        };
                        markupDataObj.push(markupData);
                    });

                    addPendingbusiness(markupDataObj);

                    setMarkupData(markupDataObj);
                    setIsLoading(false);
                }
            },
            "GET"
        );
    }

    const getBusinessNameAndId = (serviceProviderCode, mode) => {
        serviceProviderCode = serviceProviderCode.toLowerCase();
        const environment = JSON.parse(localStorage.getItem("environment"));
        let business = Object.keys(environment.availableBusinesses);
        business = business.filter(x => x !== "hotel" && x !== "air" && x !== "activity");
        var result = business.map(item => {
            //let availableBusinesses = Object.keys(environment.availableBusinesses);
            if (serviceProviderCode.indexOf(item.toLowerCase()) === -1)
                return false;
            let returnValue = "";
            if (mode !== "name")
                returnValue = parseInt(environment.availableBusinesses[item].aliasId);
            else
                returnValue = environment.availableBusinesses[item].name;
            return returnValue;
        });
        result = result.filter(Boolean);
        if (result.length > 0)
            return result[0];
    }

    const handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                props.history.push(`/Backoffice/${req}`);
            else {
                props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            props.history.push(`${req}`);
        }
    };

    const resetData = () => {
        setIsLoading(false);
        setEditBusiness('');
        setconfigurationValue(0);
        setMode('percentage');
        setEditJSONData(null);
        setErrorConfigurationValue('');
        setIsShowConfirmMessage(false);
        //setPostStatus('');
    }

    const handleConfigurationValue = (value) => {
        setconfigurationValue(value);
        /* 
        value = value.replace(/[^\d.-]/g, '');
        if (isNaN(Number(value))) {
            setconfigurationValue(configurationValue);
        }
        else {
            setconfigurationValue(Number(value));
        }
        */
    }

    const setEdit = (item) => {
        setEditBusiness(item.businessName);
        setconfigurationValue(item.value.indexOf('%') > -1 ? parseFloat(item.value.replace("%", '')) : parseFloat(item.value.replace(/[^\d.-]/g, '')));
        if (editBusiness !== "activity" && editBusiness !== "package" && editBusiness === "transfers" && editBusiness === "custom") {
            setMode("fixed");
        }
        else {
            setMode(item.value.indexOf('%') > -1 ? "percentage" : "fixed");
        }
        setEditJSONData(item);
    }

    const confirmUpdateMessage = () => {
        if (isNaN(Number(configurationValue))) {
            setErrorConfigurationValue("error");
            return;
        }
        else if (mode === "percentage" && (Number(configurationValue) >= 100 || Number(configurationValue) < 0)) {
            setErrorConfigurationValue("error");
            return;
        }
        else if (mode === "fixed" && Number(configurationValue).toString() >= 1000000 || Number(configurationValue) < 0) {
            setErrorConfigurationValue("error");
            return;
        }
        else {
            setErrorConfigurationValue('')
        }

        setIsShowConfirmMessage(true);
    }

    const startUpdate = async () => {
        setIsShowConfirmMessage(false);
        setPostStatus('pending');
        setErrorConfigurationValue('');
        /*
            deleteMarkup(commissionDetailID)

            addMarkup(reqObj-OPTIONAL)

            publishMarkup(commissionDetailID, businessID-OPTIONAL)

            addException(commissionDetailID, businessFor, configurationValue)

        */
        /*
        if (editBusiness === 'hotel' || editBusiness === 'air') {
            //  1. Delete existing
            //  2. Add markup
            //  3. publish
            //      *** Done
        }
        else if (editBusiness === 'activity') {
            //   TODO : 
            //   1. Check for Package or transfer exist?
            //   2. if No then Keep details of package and transfers (Same as first Case)
            //      1. Delete existing Activity
            //      2. Add markup
            //      3. publish
            //          *** Done
            //   3. if Yes then Keep details of package and transfers  ????
            //      0. Keep details of package and transfers
            //      1. Delete activity
            //      2. Add activity
            //      3. Add exception Package
            //      4. Add exception transfers
            //      5. Publish
            //          *** Done
        }
        else if (editBusiness === 'package' || editBusiness === 'transfers') {
            //   TODO : 
            //   1. Check package/transfers is exist?
            //   2. If No, Then check activity exist?
            //        2.1. if Yes, then Add Exception
            //        2.2  Publish  
            //              *** Done
            //        2.2. if No, 
            //              2.2.1. Add activity
            //              2.2.2. Add Exception
            //              2.2.3. Publish
            //                     *** Done
            //   3. If Yes, Then check activity exist?
            //          3.0. Keep details of activity, package and transfers (Same as activity(condition) 2nd Case)  ????
            //          3.1. Delete activity
            //          3.2. Add activity
            //          3.3. Add exception Package
            //          3.4. Add exception transfers
            //          3.5. Publish
            
        }
        */
        if (editBusiness === 'hotel' || editBusiness === 'air') {
            // 1. Delete existing
            if (editJSONData.commissionDetailID > 0)
                await deleteMarkup(editJSONData.commissionDetailID);
            // 2. Add markup
            let commissionDetailID = await addMarkup();
            // 3. publish
            await publishMarkup(commissionDetailID);
            setPostStatus('success');
        }
        else if (editBusiness === 'activity') {
            //   1. Check for Package and transfer exist?
            let transfersData = markupData.find(x => x.businessName === 'transfers')
            let packageData = markupData.find(x => x.businessName === 'package')
            if (transfersData.jsonData === null && packageData.jsonData === null) {
                //   2. if No then Keep details of package and transfers (Same as first Case)
                //      1. Delete existing Activity
                if (editJSONData.commissionDetailID > 0)
                    await deleteMarkup(editJSONData.commissionDetailID);
                //      2. Add markup
                let commissionDetailID = await addMarkup();
                //      3. publish
                await publishMarkup(commissionDetailID);
                setPostStatus('success');
            }
            else {
                //   3. if Yes then Keep details of package and transfers  ????
                //      0. Keep details of package and transfers

                //      1. Delete activity
                let commissionDetailID = markupData.find(x => x.businessName === 'activity').commissionDetailID;
                if (editJSONData.commissionDetailID > 0)
                    await deleteMarkup(commissionDetailID);
                //      2. Add activity
                commissionDetailID = await addMarkup();
                //      3. Add exception Package
                if (packageData.jsonData !== null) {
                    let defaultValue = packageData.jsonData.commissionAmount;
                    let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
                    let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed";
                    await addException(commissionDetailID, 'package', defaultAmount)
                }
                //      4. Add exception transfers
                if (transfersData.jsonData !== null) {
                    let defaultValue = transfersData.jsonData.commissionAmount;
                    let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
                    let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed";
                    await addException(commissionDetailID, 'transfers', defaultAmount)
                }
                //      5. Publish
                await publishMarkup(commissionDetailID);
                setPostStatus('success');
            }
        }
        else if (editBusiness === 'package' || editBusiness === 'transfers') {
            //   1. Check package/transfers is exist?
            let activityData = markupData.find(x => x.businessName === 'activity')
            let transfersData = markupData.find(x => x.businessName === 'transfers')
            let packageData = markupData.find(x => x.businessName === 'package')

            if (transfersData.jsonData === null || packageData.jsonData === null) {
                //   2. If No, Then check activity exist?
                if (activityData.jsonData !== null) {
                    //        2.1. if Yes, then Add Exception
                    await addException(activityData.commissionDetailID, editBusiness, configurationValue);
                    //        2.2  Publish  
                    await publishMarkup(activityData.commissionDetailID, 5);
                    setPostStatus('success');
                }
                else {
                    //        2.2. if No, 
                    //              2.2.1. Add activity
                    let commissionDetailID = await addMarkup({
                        request: {
                            businessTypeID: 5,
                            commissionTypeID: 9,
                            isPercentage: mode === "percentage",
                            defaultValue: 0,
                            evalExceptionBy: 'M',
                            publishStatus: 'PENDING',
                            isActive: true
                        }
                    });
                    //              2.2.2. Add Exception
                    await addException(commissionDetailID, editBusiness, configurationValue);
                    //              2.2.3. Publish
                    await publishMarkup(commissionDetailID);
                    setPostStatus('success');
                }
            }
            else {
                //   3. If Yes, Then check activity exist?
                if (activityData.jsonData !== null) {
                    //          3.0. Keep details of activity, package and transfers (Same as activity(condition) 2nd Case)  ????
                    //          3.1. Delete activity
                    if (activityData.commissionDetailID > 0)
                        await deleteMarkup(activityData.commissionDetailID);
                    //          3.2. Add activity
                    let defaultValue = activityData.jsonData.defaultValue;
                    let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
                    let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed";
                    let commissionDetailID = await addMarkup({
                        request: {
                            businessTypeID: 5,
                            commissionTypeID: 9,
                            isPercentage: defaultMode === "percentage",
                            defaultValue: defaultAmount,
                            evalExceptionBy: 'M',
                            publishStatus: 'PENDING',
                            isActive: true
                        }
                    });
                    //          3.3. Add exception Package
                    if (editBusiness !== "package" && packageData.jsonData !== null) {
                        let defaultValue = packageData.jsonData.commissionAmount;
                        let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
                        let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed";
                        await addException(commissionDetailID, 'package', defaultAmount)
                    }
                    else if (editBusiness === "package") {
                        await addException(commissionDetailID, 'package', configurationValue)
                    }
                    //          3.4. Add exception transfers
                    if (editBusiness !== "transfers" && transfersData.jsonData !== null) {
                        let defaultValue = transfersData.jsonData.commissionAmount;
                        let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
                        let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed";
                        await addException(commissionDetailID, 'transfers', defaultAmount)
                    }
                    else if (editBusiness === "transfers") {
                        await addException(commissionDetailID, 'transfers', configurationValue)
                    }
                    //          3.5. Publish
                    await publishMarkup(commissionDetailID);
                    setPostStatus('success');
                }
            }
        }
        getMarkupData();
    }

    const deleteMarkup = async (commissionDetailID) => {
        /* if (!businessToDelete && editJSONData.jsonData === null) {
            let commissionDetailID = await addMarkup();
            publishMarkup(commissionDetailID);
            return;
        } */

        /* let commissionDetailID = editJSONData.commissionDetailID;

        if (businessToDelete) {
            commissionDetailID = markupData.find(x => x.businessName === businessToDelete).commissionDetailID;
        } */

        let reqObj = {
            request: {
                CommissionDetailsID: commissionDetailID
            }
        }
        let reqURL = "admin/markupsetup/publish/delete";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqObj,
                (data) => {
                    if (data.error) {
                        setPostStatus('error');
                        return;
                    }
                    else {
                        resolve();
                    }
                }, "POST");
        });
    }

    const addMarkup = async (reqObj) => { //, isPublishRequired
        const environment = JSON.parse(localStorage.getItem("environment"));
        if (!reqObj) {
            reqObj = {
                request: {
                    businessTypeID: environment.availableBusinesses[editBusiness].aliasId ? environment.availableBusinesses[editBusiness].aliasId : environment.availableBusinesses[editBusiness].id,
                    commissionTypeID: 9,
                    isPercentage: mode === "percentage",
                    defaultValue: configurationValue,
                    evalExceptionBy: 'M',
                    publishStatus: 'PENDING',
                    isActive: true
                }
            }
        }
        let reqURL = "admin/markupsetup/edit";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqObj,
                (data) => {
                    if (data.error) {
                        setPostStatus('error');
                        return;
                    }
                    else {
                        let commissionDetailID = data.response.commissionDetailID;
                        //if (isPublishRequired === false)
                        resolve(commissionDetailID);
                        /* else
                            publishMarkup(commissionDetailID); */
                    }
                }, "POST");
        });
    }

    const publishMarkup = (commissionDetailID, businessID) => {
        const environment = JSON.parse(localStorage.getItem("environment"));
        let reqObj = {
            request: {
                businessTypeID: businessID ?? (environment.availableBusinesses[editBusiness].aliasId ? environment.availableBusinesses[editBusiness].aliasId : environment.availableBusinesses[editBusiness].id),
                commissionTypeID: 9,
                CommissionDetailsID: commissionDetailID
            }
        }
        let reqURL = "admin/markupsetup/publish";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqObj,
                (data) => {
                    if (data.error) {
                        setPostStatus('error');
                        return;
                    }
                    else {
                        resolve();
                    }
                }, "POST");
        });
    }

    const addException = async (commissionDetailID, businessFor, configurationValue) => { //, isPublishRequired
        const environment = JSON.parse(localStorage.getItem("environment"));
        let providercode = activityServiceProviders.find(x => x.toLowerCase().indexOf(businessFor) > -1);
        let reqObj = {
            request: {
                commissionDetailsID: commissionDetailID,
                ProviderCode: providercode,
                defaultValue: configurationValue,
                /* businessTypeID: environment.availableBusinesses[businessFor].aliasId
                    ? environment.availableBusinesses[businessFor].aliasId
                    : environment.availableBusinesses[businessFor].id, */
            }
        }
        let reqURL = "admin/exception/save";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqObj,
                (data) => {
                    if (data.error) {
                        setPostStatus('error');
                        return;
                    }
                    else {
                        resolve();
                        /* if (isPublishRequired === false) {
                            resolve();
                        }
                        else
                            publishMarkup(commissionDetailID, 5); */
                    }
                }, "POST");
        });
    }

    const handleSuccessClose = () => {
        setPostStatus('');
    }

    if (!AuthorizeComponentCheck(props.userInfo.rolePermissions, "dashboard-menu~agentsettings-markup-setup")) {
        props.history.push('/');
    }

    const isUpdateButtonEnabled = () => {
        if (!editJSONData)
            return false;
        if (editJSONData.jsonData === null) {
            if (Number(configurationValue) === 0)
                return false
            else
                return true;
        }
        let isUpdateButtonEnabled = false;
        let defaultValue = editJSONData.jsonData.defaultValue ?? editJSONData.jsonData.commissionAmount;
        let defaultAmount = defaultValue.indexOf('%') > -1 ? parseFloat(defaultValue.replace("%", '')) : parseFloat(defaultValue.replace(/[^\d.-]/g, ''));
        let defaultMode = defaultValue.indexOf('%') > -1 ? "percentage" : "fixed"
        if (mode !== defaultMode)
            isUpdateButtonEnabled = true;
        if (defaultAmount !== parseFloat(configurationValue))
            isUpdateButtonEnabled = true;
        return isUpdateButtonEnabled;
    }

    return (
        <React.Fragment>
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Markup Setup
                        </title>
                    </Helmet>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9">
                                <h1 className="text-white m-0 p-0 f30">
                                    <SVGIcon
                                        name="file-text"
                                        width="24"
                                        height="24"
                                        className="mr-3"
                                    ></SVGIcon>
                                    Markup Setup
                                </h1>
                            </div>
                            <div className="col-lg-3 d-flex justify-content-end">
                                {process.env.NODE_ENV === "development" &&
                                    <button
                                        className="btn btn-sm btn-primary pull-right mr-2"
                                        onClick={() => getMarkupData()}
                                    >
                                        {Trans("Refresh Details")}
                                    </button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={handleMenuClick} userInfo={props.userInfo} />
                        </div>
                        <div className="col-lg-4">
                            {/*  <div className="row">
                                <div className="col-lg-12">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => getMarkupData()}
                                    >
                                        {Trans("Refresh")}
                                    </button>
                                </div>
                            </div> */}

                            <div className="row quotation-list-grid-header">
                                <div className="col-lg-12">
                                    <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                                        <div className="row d-flex flex-row">
                                            <div className="col-lg-4">
                                                <b>Business</b>
                                            </div>
                                            <div className="col-lg-4">
                                                <b>Markup</b>
                                            </div>
                                            <div className="col-lg-4">
                                                <b></b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isLoading && [...Array(5).keys()].map((item) => {
                                return (
                                    <div className="pl-3 pr-3 pt-2 bookings-loading" key={item}>
                                        <div className="pb-2">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <b className="w-100 d-inline-block mb-2">&nbsp;</b>
                                                </div>
                                                <div className="col-lg-4">
                                                    <b className="w-100 d-inline-block mb-2">&nbsp;</b>
                                                </div>
                                                <AuthorizeComponent title={"agentsettings-markup-setup~modify"} type="button" rolepermissions={props.userInfo.rolePermissions}>
                                                    <div className="col-lg-4">
                                                        <b className="w-100 d-inline-block mb-2">&nbsp;</b>
                                                    </div>
                                                </AuthorizeComponent>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            }
                            {!isLoading && markupData.filter(x => x.businessName !== "custom").map((item, index) => {
                                return <div className="border-bottom pl-3 pr-3 pt-3 position-relative" key={index}>
                                    <div className="row d-flex flex-row mb-2">
                                        <div className="col-lg-4 pb-3 text-capitalize">{item.businessName === "air" ? "Flight" : item.businessName}</div>
                                        <div className="col-lg-5 pb-3">{item.value ? item.value.indexOf('%') > 0 ? item.value.replace('%', " %") : item.value + " Fixed" : "0.00 %"}</div>
                                        <AuthorizeComponent title="agentsettings-markup-setup~modify" type="button" rolepermissions={props.userInfo.rolePermissions}>
                                            <div className="col-lg-3">
                                                {!editBusiness &&
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => AuthorizeComponentCheck(props.userInfo.rolePermissions, "agentsettings-markup-setup~modify") ? setEdit(item) : setIsShowAuthorizePopup(true)}
                                                    >
                                                        {Trans("Modify")}
                                                    </button>}
                                            </div>
                                        </AuthorizeComponent>
                                    </div>
                                </div>
                            })}
                        </div>

                        {editBusiness &&
                            <div className="col-lg-4" style={{
                                "top": "40px", "left": "40px",

                            }}>
                                <div style={{
                                    "background": "#f182473b",
                                    "maxHeight": "320px", "paddingTop": "25px", "paddingLeft": "25px"
                                }}>
                                    <div className="row">

                                        <div className="col-lg-12">
                                            <h4 className='text-capitalize'>{editBusiness === "air" ? "flight" : editBusiness} Configuration</h4>
                                        </div>
                                    </div>
                                    <div className="row form-group ml-0">
                                        {(editBusiness !== "activity" && editBusiness !== "package"
                                            && editBusiness !== "transfers" && editBusiness !== "custom")
                                            ? <React.Fragment>
                                                <div className="col-sm-4 ml-3 custom-control custom-switch mt-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={mode === "percentage" ? true : false}
                                                        className="custom-control-input"
                                                        id="percentage"
                                                        onChange={(e) => setMode("percentage")}
                                                        disabled={(editBusiness === "package" || editBusiness === "transfers") ? true : false}
                                                    />
                                                    <label className="custom-control-label" htmlFor="percentage">
                                                        % Value
                                                    </label>
                                                </div>
                                                <div className="col-sm-4 custom-control custom-switch mt-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={mode === "fixed" ? true : false}
                                                        className="custom-control-input"
                                                        id='fixed'
                                                        onChange={(e) => setMode("fixed")}
                                                        disabled={(editBusiness === "package" || editBusiness === "transfers") ? true : false}
                                                    />
                                                    <label className="custom-control-label" htmlFor="fixed">
                                                        Fixed Value
                                                    </label>
                                                </div>
                                            </React.Fragment>
                                            : <div className="col-sm-8 mt-3">
                                                <label className="label">Mode : Fixed Value</label>
                                            </div>
                                        }
                                        <div className="col-lg-12 pr-5 mt-3">
                                            <div className="form-group email">
                                                <label htmlFor="defaultValue">Configuration Value</label>
                                                <input type="text" name="defaultValue" className={"form-control " + (errorConfigurationValue === 'error' ? " border border-danger" : "")}
                                                    value={configurationValue}
                                                    onChange={(e) => handleConfigurationValue(e.target.value)} />
                                            </div>
                                        </div>
                                        {postStatus && postStatus === "pending" ?
                                            <React.Fragment>
                                                <div className="col-lg-12 p-3">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                                        {Trans("Update")}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-primary ml-2"
                                                    >
                                                        {Trans("Cancel")}
                                                    </button>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div className="col-lg-12 p-3">
                                                    {isUpdateButtonEnabled() ?
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => confirmUpdateMessage()}
                                                        >
                                                            {Trans("Update")}
                                                        </button>
                                                        : <button
                                                            className="btn btn-sm btn-secondary"
                                                        >
                                                            {Trans("Update")}
                                                        </button>}
                                                    <button
                                                        className="btn btn-sm btn-primary ml-2"
                                                        onClick={resetData}
                                                    >
                                                        {Trans("Cancel")}
                                                    </button>
                                                </div>
                                            </React.Fragment>}

                                        {postStatus && postStatus === "error" &&
                                            <div className="col-lg-12 col-lg-12 pt-0 pb-3">
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">Ooops! Something went wrong. Please try after sometime.</small>
                                            </div>}




                                    </div>
                                </div>
                                {/* {(editBusiness === "package" || editBusiness === "transfers") &&
                                    <div>
                                        <ul className={"alert alert-info d-inline-block"}>
                                            <li className="ml-3">User can not change value type for Package and Transfers.</li>
                                            <li className="ml-3">To change the value type user need to modify it for Activity first.</li>
                                        </ul>
                                    </div>
                                }
                                {(editBusiness === "activity") &&
                                    <div>
                                        <ul className={"alert alert-info d-inline-block"}>
                                            <li className="ml-3">Activity value type will be assigned to Package and Transfers automatically.</li>
                                            <li className="ml-3">After update activity, Kindly make chanage respectively for package and transfers business.</li>
                                        </ul>
                                    </div>
                                } */}
                            </div>
                        }
                    </div>
                </div>
            </div>

            {postStatus === "success" &&
                <MessageBar Message={"Data saved successfully."} handleClose={() => handleSuccessClose()} />
            }
            {
                isShowConfirmMessage &&
                <ModelPopup
                    header={"Are you sure?"}
                    content={
                        <div>
                            <div>Are you sure you want to update Markup setup for {editBusiness.toUpperCase() === "AIR" ? "FLIGHT" : editBusiness.toUpperCase()}?</div>
                            <div>Updated Markup setup will be effective immediately.</div>
                            <button
                                className="btn btn-primary pull-right m-1 "
                                onClick={() => startUpdate()}
                            >
                                {Trans("_ok")}
                            </button>

                            <button
                                className="btn btn-primary pull-right m-1 "
                                onClick={() => setIsShowConfirmMessage(false)}
                            >
                                {Trans("_cancel")}
                            </button>
                        </div>
                    }
                    handleHide={() => { setIsShowConfirmMessage(false) }}
                />
            }
            {isshowauthorizepopup &&
                <ModelPopupAuthorize
                    header={""}
                    content={""}
                    handleHide={() => setIsShowAuthorizePopup(false)}
                    history={props.history}
                />
            }
        </React.Fragment >
    );
}

export default MarkupSetup;