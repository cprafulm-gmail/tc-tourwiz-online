import moment from "moment";
import React, { Component } from "react";
import InquiryForm from "../components/quotation/inquiry-form";
import SVGIcon from "../helpers/svg-icon";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import * as Global from "../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ActivityLogDetails from "../components/quotation/activity-log-details";
import ModelPopup from "../helpers/model";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import { Helmet } from "react-helmet";
import Loader from "../../src/components/common/loader";
import MessageBar from '../../src/components/admin/message-bar';

class Inquiry extends Component {
  constructor(props) {
    super(props);
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry")) {
      this.props.history.push('/');
    }
    this.state = {
      isBtnLoading: false,
      isSucessMsg: false,
      inquiryKey: "1",
      inquiryToken: "",
      inquiryInfo: "",
      phoneNotoValidate: "",
      employeesOptions: [],
      activityLogDetails: null,
      isSubscriptionPlanend: false,
      SucessMsg: "",
    };
  }
  addInquiry = (data) => {
    this.setState({ isErrorMsg: "", isBtnLoading: true });

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let quota = Global.LimitationQuota["dashboard-menu~inquiries-create-inquiry"];

    var reqURL = "inquiry";
    var reqOBJ = {
      title: data.title,
      from: data.customerName,
      fromEmail: data.email,
      isSendEmail: data.sendEmail,
      data: data,
      status: data.status,
      startDate: moment(data.startDate).format('YYYY-MM-DD'),
      endDate: moment(data.endDate).format('YYYY-MM-DD'),
      followupDate: moment(data.followupDate).format('YYYY-MM-DD'),
      priority: data.priority == "" ? null : data.priority,
      userID: data.userID,
      createCustomer_validateEmailAndPhone: !this.state.editMode,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(data.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        if (data.code && data.code === 101) {
          this.setState({ isSubscriptionPlanend: true, isBtnLoading: false });
        }
        else {
          this.setState({ isErrorMsg: data.error, isBtnLoading: false });
        }
      }
      else {
        if (quotaUsage["totalUsed" + quota] === null)
          quotaUsage["totalUsed" + quota] = 1;
        else
          quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
        localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
        //this.props.history.push(`/InquiryList`)
        let SucessMsg = "Inquiry Saved Successfully!";
        this.setState({
          isBtnLoading: false,
          inquiryToken: data.status,
          inquiryInfo: reqOBJ,
          showMessageBar: true,
          SucessMsg: SucessMsg,
          popupTitle: "Create " + this.state.type,
          popupContent: <div>
            <div>Inquiry Saved Successfully.</div>
            <button
              className="btn btn-primary pull-right m-1 "
              onClick={() => this.props.history.push(`/InquiryList`)}
            >
              {Trans("Ok")}
            </button>
          </div>
        });
      }
      /*
      let bookingForInfo = JSON.parse(sessionStorage.getItem("bookingForInfo"));

      if (
        (bookingForInfo &&
          !bookingForInfo?.firstName &&
          !bookingForInfo?.contactInformation?.email &&
          !bookingForInfo?.contactInformation?.phoneNumber) ||
        !bookingForInfo
      ) {
        this.addCustomer(reqOBJ);
      }
      */
    });
  };

  closesMessageBar = () => {
    this.props.history.push(`/InquiryList`)
  }

  updateInquiry = (data) => {
    this.setState({ isErrorMsg: "", isBtnLoading: true });
    let id = this.props.location.pathname.replace("/Inquiry/", "");

    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: data.title,
      from: data.customerName,
      fromEmail: data.email,
      isSendEmail: data.sendEmail,
      id: id,
      data: data,
      status: data.status,
      startDate: moment(data.startDate).format('YYYY-MM-DD'),
      endDate: moment(data.endDate).format('YYYY-MM-DD'),
      followupDate: moment(data.followupDate).format('YYYY-MM-DD'),
      priority: data.priority == "" ? null : data.priority,
      userID: data.userID,
      createCustomer_validateEmailAndPhone: !this.state.editMode,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(data.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"))
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error)
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      else {
        let SucessMsg = "Inquiry Saved Successfully!";
        this.setState({
          isBtnLoading: false,
          inquiryToken: data.status,
          inquiryInfo: reqOBJ,
          showMessageBar: true,
          SucessMsg: SucessMsg,
          popupTitle: "Create " + this.state.type,
          popupContent: <div>
            <div>Inquiry Saved Successfully.</div>
            <button
              className="btn btn-primary pull-right m-1 "
              onClick={() => this.props.history.push(`/InquiryList`)}
            >
              {Trans("Ok")}
            </button>
          </div>
        });
      }
    });
  };

  handleManageInquiry = () => {
    this.props.history.push(`/InquiryList`);
  };

  handleAddItinerary = () => {
    if (!GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~itineraries-create-itineraries")) {
      this.setState({ isSubscriptionPlanend: true });
    }
    else {
      this.InquiryDetails("Itinerary");
    }
  };

  handleAddQuotation = () => {
    if (!GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~master-quotation-create-quotation")) {
      this.setState({ isSubscriptionPlanend: true });
    }
    else {
      this.InquiryDetails("Quotation");
    }
  };

  handleAddPackage = () => {
    if (!GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~master-packages-create-package")) {
      this.setState({ isSubscriptionPlanend: true });
    }
    else {
      this.CratePackage(null);
    }
  }

  /* getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
    });
  }; */

  CratePackage = () => {

    let supplierObj = {
      supplierCurrency: "",
      conversionRate: "",
      supplierCostPrice: 0,
      supplierTaxPrice: "",
      costPrice: 0,
      brn: "",
      markupPrice: 0,
      discountPrice: 0,
      CGSTPrice: 0,
      SGSTPrice: 0,
      IGSTPrice: 0,
      bookBefore: "",
      sellPrice: 0,
      amountWithoutGST: 0,
      isInclusive: false,
      percentage: (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
      processingFees: 0,
      tax1: 0,
      tax2: 0,
      tax3: 0,
      tax4: 0,
      tax5: 0,
      isTax1Modified: false,
      isTax2Modified: false,
      isTax3Modified: false,
      isTax4Modified: false,
      isTax5Modified: false,
      taxType: "CGSTSGST",
      totalAmount: 0,
      isSellPriceReadonly: false,
      flight: "",
      hotelDetails: "",
      Adults: 1,
      Child: 0,
      Infants: 0,
      supplierCostPriceAdult: "",
      supplierCostPriceChild: "",
      supplierCostPriceInfant: ""
    };

    let reqURL = "cms/package/add";

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let element = ("dashboard-menu~packages-create-package");
    let quota = Global.LimitationQuota[element];

    var item = this.state.inquiryInfo;
    let inquiryToken = this.state.inquiryToken;
    const quotationInfo = { ...item.data };
    quotationInfo.duration = Number(quotationInfo.duration);
    if (quotationInfo.duration === 0)
      quotationInfo.duration = 1;
    // if (quotationInfo.inquiryType.toLowerCase() === "hotel" && quotationInfo.duration !== 0)
    //   quotationInfo.duration = quotationInfo.duration + 1;
    if (quotationInfo.inquiryType.toLowerCase() !== "hotel" && quotationInfo.duration !== 0)
      quotationInfo.duration = quotationInfo.duration;
    quotationInfo.duration = quotationInfo.duration === -1 ? 1 : quotationInfo.duration;
    //item.data.duration = quotationInfo.duration;

    let reqOBJ = {
      request: {
        siteURL: "",
        countryID: "101",
        stateID: "",
        cityID: "",
        validFrom: moment(quotationInfo.startDate).format('YYYY-MM-DD'),
        validTo: moment(quotationInfo.endDate).format('YYYY-MM-DD'),
        bookingStartDate: "",
        bookingEndDate: "",
        packageName: quotationInfo.title,
        specialPromotionType: "",
        summaryDescription: "",
        description: "",
        termsConditions: "",
        sellPriceDisplay: 0,
        currencyID: "1",
        isShowOnHomePage: false,
        packageThemes: 3,
        cultureCode: "en-US",
        offerPrice: "",
        rating: 0,
        agentId: this.props.userInfo.agentID,
        userId: quotationInfo.userID,
        customerName: quotationInfo.customerName,
        customerEmail: quotationInfo.email ? quotationInfo.email : quotationInfo.phone + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"),
        customerPhone: quotationInfo.phone,
        images: [],
        inclusionExclusion: [],
        bookBefore: "",
        vendor: "",
        twPriceGuideLine: "",
        isShowOnMarketPlace: false,
        totalAmount: 0,
        IGST: 0,
        CGST: 0,
        SGST: 0,
        PDFList: [],
        Status: "confirm",
        IsMaster: false,
        Duration: null,
        supplierObj: JSON.stringify(supplierObj),
        IsCMSPackage: false,
        price: 0,
        createCustomer_validateEmailAndPhone: true,
        createCustomer_UseAgentDetailInEmail: true,
        createCustomer_iscmsportalcreated: false,
        InquiryId: inquiryToken
      }
    };

    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {
          if (quotaUsage["totalUsed" + quota] === null)
            quotaUsage["totalUsed" + quota] = 1;
          else
            quotaUsage["totalUsed" + quota] =
              quotaUsage["totalUsed" + quota] + 1;
          localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
          item.data.itemId = resonsedata.id;
          item.data.itemType = "Package";
          this.handleUpdateInquiry(item);
        } else {
          if (resonsedata.code) {
            if (resonsedata.code === 101) {
              this.setState({ isSubscriptionPlanend: true, isBtnLoading: false });
            }
            else {
              this.setState({ isErrorMsg: resonsedata.error, isBtnLoading: false });
            }
          }
        }
      }.bind(this),
      "POST"
    );
  }

  InquiryDetails = (type) => {
    let item = this.state.inquiryInfo;
    if (type === "Itinerary") {
      item.data.configurations = {
        isShowTotalPrice: true,
        isShowItemizedPrice: true,
        isShowFlightPrices: true,
        isShowImage: true,
        isHidePrice: true,
        ShowhideElementname: "showAllPrices",
        isPackagePricing: false,
        isHideFareBreakupInvoice: false
      };
    }
    else if (type === "Quotation") {
      item.data.configurations = {
        isShowTotalPrice: false,
        isShowItemizedPrice: true,
        isShowFlightPrices: true,
        isShowImage: true,
        isHidePrice: true,
        ShowhideElementname: "showAllPrices",
        isPackagePricing: false,
        isHideFareBreakupInvoice: false
      };
    }
    let inquiryToken = this.state.inquiryToken;
    const quotationInfo = { ...item.data };
    quotationInfo.duration = Number(quotationInfo.duration);
    if (quotationInfo.duration === 0)
      quotationInfo.duration = 1;
    // if (quotationInfo.inquiryType.toLowerCase() === "hotel" && quotationInfo.duration !== 0)
    //   quotationInfo.duration = quotationInfo.duration + 1;
    if (quotationInfo.inquiryType.toLowerCase() !== "hotel" && quotationInfo.duration !== 0)
      quotationInfo.duration = quotationInfo.duration;
    quotationInfo.duration = quotationInfo.duration === -1 ? 1 : quotationInfo.duration;
    //item.data.duration = quotationInfo.duration;
    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let element = type === "Itinerary" ? "dashboard-menu~itineraries-create-itineraries" : "dashboard-menu~quotation-create-quotation";
    let quota = Global.LimitationQuota[element];

    let reqURL = "quotation";
    let reqOBJ = {
      title: quotationInfo.title,
      name: quotationInfo.title,
      owner: quotationInfo.customerName,
      isPublic: true,
      type: type,
      userID: quotationInfo.userID,
      data: {
        name: quotationInfo.title,
        title: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email ? quotationInfo.email : quotationInfo.phone + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"),
        phone: quotationInfo.phone,
        duration: quotationInfo.duration === -1 ? 1 : quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format('YYYY-MM-DD'),
        endDate: moment(quotationInfo.endDate).format('YYYY-MM-DD'),
        type: type,
        status: "saved",
        from: "Inquiry-" + type,
        month: quotationInfo.month,
        typetheme: quotationInfo.typetheme,
        budget: quotationInfo.budget,
        inclusions: quotationInfo.inclusions,
        adults: quotationInfo.adults,
        children: quotationInfo.children,
        infant: quotationInfo.infant,
        priority: quotationInfo?.priority,
        tripType: quotationInfo?.tripType,
        followupDate: quotationInfo?.followupDate,
        requirements: quotationInfo.requirements,
        inquiryId: inquiryToken,
        configurations: quotationInfo.configurations
      },
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        if (data.code && data.code === 101) {
          this.setState({ isSubscriptionPlanend: true, isBtnLoading: false });
        }
        else {
          this.setState({ isErrorMsg: data.error, isBtnLoading: false });
        }
      }
      else {
        if (quotaUsage["totalUsed" + quota] === null)
          quotaUsage["totalUsed" + quota] = 1;
        else
          quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
        localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
        item.data.itemId = data.id;
        item.data.itemType = type;
        this.handleUpdateInquiry(item);
      }
    });
  };

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }

  handleUpdateInquiry = (data) => {
    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: data.data.title,
      from: data.data.customerName,
      fromEmail: data.data.email,
      id: this.state.inquiryToken,
      data: data.data,
      status: data.status,
      startDate: moment(data.startDate).format('YYYY-MM-DD'),
      endDate: moment(data.endDate).format('YYYY-MM-DD'),
      userID: data.userID,
      priority: data.priority
    };

    apiRequester_quotation_api(reqURL, reqOBJ, () => {
      localStorage.setItem("inquiryId", this.state.inquiryToken);
      localStorage.setItem("cartLocalId", data.data.itemId);
      localStorage.setItem("quotationDetails", JSON.stringify(data.data));
      localStorage.setItem("quotationItems", JSON.stringify([]));
      if (data.data.itemType.toLowerCase() === "package") {
        this.props.history.push(`/Package/Edit/${data.data.itemId}`);
      }
      else {
        this.props.history.push(`/${data.data.itemType}/DetailsInquiry`);
      }
    });
  };

  handleNewInquiry = () => {
    this.setState({
      isBtnLoading: false,
      isSucessMsg: false,
      inquiryKey: this.state.inquiryKey + 1,
    });
  };

  addCustomer = (customerData) => {
    this.setState({ isErrorMsg: "", isBtnLoading: true });

    var reqURL = "api/v1/customer/create";
    var reqOBJ = {
      Request: {
        UserDisplayName: customerData.customerName.trim(),
        FirstName: customerData.customerName.trim()?.split(" ")[0],
        LastName: customerData.customerName.trim()?.split(" ")[1] !== undefined ? customerData.customerName.trim()?.split(" ")[1] : customerData?.customerName.trim(),
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
        },
        ContactInformation: {
          PhoneNumber: customerData.phone,
          PhoneNumberCountryCode: "",
          Email: customerData.email,
        },
      },
      Flags: {
        validateEmailAndPhone: !this.state.editMode,
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(customerData.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"))
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (data?.response?.token) {
        sessionStorage.setItem("personateId", data.response.token);
      }

      if (data.status.code === 260031 && customerData.phoneNotoValidate !== customerData.phone) {
        this.setState({
          isBtnLoading: false,
          isErrorMsg: "Given phone number is associated with another customer. Kindly enter another phone number."
        });
      }
      else
        !this.state.editMode ? this.addInquiry(customerData) : this.updateInquiry(customerData)
    });
  };

  getInquiryDetails = () => {
    let id = this.props.location.pathname.replace("/Inquiry/", "");

    var reqURL = "inquiry?id=" + id;
    var reqOBJ = "";

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          inquiryDetails: data,
          inquiryKey: this.state.inquiryKey + 1,
        });
      },
      "GET"
    );
  };

  componentDidMount() {
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry")) {
      this.props.history.push('/');
    }
    //this.getAuthToken();
    const editMode = this.props.location.pathname === "/Inquiry" ? false : true;
    this.setState({ editMode });
    this.getEmployees();
    editMode && this.getInquiryDetails();
  }

  getEmployees() {
    let reqOBJ = { Request: { IsActive: true, PageNumber: 0, PageSize: 0 } };
    let reqURL = "admin/employee/list";
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.error) {
          data.response = [];
        }
        if (data.response.length > 0) {
          let employeesOptions = data.response.map(item => {
            return {
              label: item.fullName ?? item.firstName + " " + item.lastName,
              value: item.userID,
              isLoggedinEmployee: item.isLoggedinEmployee,
            }
          });

          //let stateData = this.state.data;
          //stateData.userID = employeesOptions.find(x => x.isLoggedinEmployee).value;
          this.setState({ employeesOptions, isLoadingEmployees: false })
        }
        else {
          this.setState({ employeesOptions: [], isLoadingEmployees: false })
        }
      }.bind(this),
      "POST"
    );
  }
  getActivityLogDetails = () => {
    this.setState({ isErrorMsg: "", isBtnLoading_activityLog: true });
    let id = this.props.location.pathname.replace("/Inquiry/", "");

    var reqURL = "inquiry/activitylog?id=" + id;

    apiRequester_quotation_api(reqURL, null, (data) => {
      if (data.error)
        this.setState({ isErrorMsg: data.error, isBtnLoading_activityLog: false });
      else {
        this.setState({
          isBtnLoading_activityLog: false,
          activityLogDetails: data.response,
        });
      }
    }, 'GET');
  };

  handleHideActivityLogPopup = () => {
    this.setState({
      activityLogDetails: null,
    });
  };

  render() {
    const { isErrorMsg, isSucessMsg, isBtnLoading, isBtnLoading_activityLog, inquiryKey, inquiryDetails, employeesOptions } = this.state;
    const { userInfo } = this.props;
    if (!AuthorizeComponentCheck(userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry")) {
      this.props.history.push('/');
    }
    const editMode = this.props.location.pathname === "/Inquiry" ? false : true;
    if ((editMode && !inquiryDetails) || employeesOptions.length == 0) {
      return <>
        <Loader />
      </>
    }
    return (
      <>
        <Helmet>
          <title>
            {!editMode ? "Create" : "Edit"} Inquiry
          </title>
        </Helmet>
        <div className="quotation quotation-list">
          <div className="title-bg pt-3 pb-3 mb-3">
            <div className="container">
              <h1 className="text-white m-0 p-0 f30">
                <SVGIcon name="file-text" width="24" height="24" className="mr-3"></SVGIcon>
                {!editMode ? "Create" : "Edit"} Inquiry
                <AuthorizeComponent title="dashboard-menu~inquiries-manage-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                  <button
                    className="btn btn-sm btn-primary pull-right"
                    onClick={() => this.props.history.push(`/InquiryList`)}
                  >
                    {Trans("Manage Inquiries")}
                  </button>
                </AuthorizeComponent>
              </h1>
            </div>
          </div>

          <div className="container">
            <InquiryForm
              key={inquiryKey}
              handleInquiry={!this.state.editMode ? this.addInquiry : this.updateInquiry}
              isBtnLoading={isBtnLoading}
              isBtnLoading_activityLog={isBtnLoading_activityLog}
              isSucessMsg={isSucessMsg}
              isErrorMsg={isErrorMsg}
              handleManageInquiry={this.handleManageInquiry}
              handleAddItinerary={this.handleAddItinerary}
              handleAddQuotation={this.handleAddQuotation}
              handleAddPackage={this.handleAddPackage}
              handleNewInquiry={this.handleNewInquiry}
              editMode={editMode}
              inquiryDetails={inquiryDetails}
              userInfo={this.props.userInfo}
              status={inquiryDetails?.status ?? null}
              history={this.props.history}
              employeesOptions={employeesOptions}
              getActivityLogDetails={this.getActivityLogDetails}
              activityLogDetails={this.state.activityLogDetails}
            />
          </div>
          {this.state.showMessageBar &&
            <MessageBar Message={this.state.SucessMsg} handleClose={() => { this.closesMessageBar() }
            } />
          }
          {this.state.activityLogDetails ? (
            <ModelPopup
              header={"Activity Log"}
              content={<ActivityLogDetails activityLogDetails={this.state.activityLogDetails} userInfo={userInfo} />}
              handleHide={this.handleHideActivityLogPopup}
            />
          ) : null}
          {
            this.state.isSubscriptionPlanend &&
            <ModelLimitExceeded
              header={"Plan Limitations Exceeded"}
              content={"The maximum recommended plan has been exceeded"}
              handleHide={this.hidelimitpopup}
              history={this.props.history}
            />
          }
        </div>
      </>
    );
  }
}

// Tourwiz Features Page Changes
export default Inquiry;
