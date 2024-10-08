import React, { Component, Fragment } from "react";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import CustomerAddSelect from "../common/customer-add-select";
import moment from "moment";
import SVGIcon from "../../helpers/svg-icon";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Select from "react-select";
import ModelPopup from "../../helpers/model";
import Imagelibrary from "./ImageLibrary";
import trashImage from "../../assets/images/x-circle.svg"
import ImageNotFound from "../../assets/images/no-image-found.png";
import QuotationPackagePricing from "./quotation-package-pricing";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";

class QuotationCreate extends Form {
  state = {
    data: {
      customerName: "",
      email: "",
      phone: "",
      title: "",
      duration: "",
      startDate: moment().add("10", "days").format('YYYY-MM-DD'),
      endDate: moment().add("15", "days").format('YYYY-MM-DD'),
      followupDate: moment().add("9", "days").format('YYYY-MM-DD'),
      dates: "",
      datesIsValid: "valid",
      cutOfDays: 1,
      stayInDays: 4,
      adults: "",
      child: "",
      infant: "",
      createdDate: "",
      status: "New",
      budget: localStorage.getItem("quotationItems") && this.props.mode !== "CreateQuick" ?
        JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          : JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            : 0
        : 0,
      address: "",
      gstno: "",
      phoneNotoValidate: "",
      userID: 0,
      // this.props.employeesOptions.length > 0
      //   ? this.props.employeesOptionsthis.props.employeesOptions.find(x => x.isLoggedinEmployee).value
      //   : "",
      imageURL: "",
      assignmentComment: "",
      inquiryType: "Packages",
      bookingFor: "Individual",
      imageExtension: "",
      ImageName: "",
      configurations: { ...Global.itineraryConfigurations },
      packagePricingData: this.props.mode === "Edit" && localStorage.getItem("quotationItems")
        ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem ?? defaultPackagePricingData
        : defaultPackagePricingData,
      isQuickProposal: false
    },
    isShowPopup: false,
    title: "",
    body: "",
    sizeClass: "",
    errors: {},
    employeesOptions: [],

  };


  validate = () => {
    const errors = {};
    const { type } = this.props;
    const { data } = this.state;
    if (type === 'Itinerary' || type === 'Quotation') {
      if (!this.validateFormData(data.customerName, "require"))
        errors.customerName = "Customer Name required";
      else if (!this.validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/))
        errors.customerName = "< and > characters not allowed";

      if (data.email && !this.validateFormData(data.email, "email")) errors.email = "Invalid Email";

      if (data.phone === "" || !this.validateFormData(data.phone, "require") || data.phone === "1-" || data.phone.split('-')[1] === "") errors.phone = "Phone required";

      if (data.phone && data.phone !== "")
        if (!this.validateFormData(data.phone, "phonenumber")) errors.phone = "Invalid Contact Phone";

      if (data.phone !== "" &&
        !this.validateFormData(data.phone, "phonenumber_length", {
          min: 8,
          max: 14,
        })
      )
        errors.phone = Trans("_error_mobilenumber_phonenumber_length");
    }
    if (data.budget && data.budget !== "" && !this.validateFormData(data.budget, "numeric")) errors.budget = "Please enter budget in numeric only";
    else if (data.budget && data.budget !== "" && Number(data.budget) < 0) errors.budget = "Budget must be greater than zero";
    else if (errors) {
      delete Object.assign(errors)["budget"];
    }
    if (data.adults && data.adults !== "" && !this.validateFormData(data.adults, "only-numeric")) errors.adults = "Please enter adults(s) in numeric only";
    else if (data.adults && data.adults !== "" && Number(data.adults) < 0) errors.adults = "Adult(s) must be greater than zero";
    else if (errors) {
      delete Object.assign(errors)["adult"];
    }
    if (data.children && data.children !== "" && !this.validateFormData(data.children, "only-numeric")) errors.children = "Please enter children(s) in numeric only";
    else if (data.children && data.children !== "" && Number(data.children) < 0) errors.children = "Child(s) must be greater than zero";
    else if (errors) {
      delete Object.assign(errors)["child"];
    }
    if (data.infant && data.infant !== "" && !this.validateFormData(data.infant, "only-numeric")) errors.infant = "Please enter infant(s) in numeric only";
    else if (data.infant && data.infant !== "" && Number(data.infant) < 0) errors.infant = "Infant(s) must be greater than zero";
    else if (errors) {
      delete Object.assign(errors)["infant"];
    }

    if (!this.validateFormData(data.title, "require"))

      errors.title = this.props.type === "Quotation"
        ? Trans("_quotationReplaceKey") + " title required"
        : this.props.type === "Quotation_Master"
          ? Trans("_quotationReplaceKey") + " Master title required"
          : this.props.type === "Itinerary_Master"
            ? "Itinerary Master title required"
            : this.props.type + " title required";
    // if (this.props.mode !== "Create") {
    //   if ((this.props.userID !== this.state.data.userID
    //     || (this.state.data.status !== 'Other' && this.props.status !== this.state.data.status))
    //   ) {
    //     if (!this.validateFormData(data.assignmentComment, "require"))
    //       errors.assignmentComment = "Comments required";
    //   }
    // }
    if (data.title && !this.validateFormData(data.title, "special-characters-not-allowed", /[<>]/))
      errors.title = "< and > characters not allowed";

    return Object.keys(errors).length === 0 ? null : errors;
  };
  uploadPopupData = () => {
    this.setState({ isShowPopup: true, title: "Content Library", body: <Imagelibrary imageDetails={this.imageDetails} />, sizeClass: "modal-dialog modal-lg modal-dialog-centered" })
  }
  quotationpreviewPopupData = () => {
    this.setState({
      title: Trans("_quotationReplaceKeys") + " Title Image",
      isShowPopup: true,
      body:
        <img
          src={this.state.data.imageURL}
          className="img-responsive img-thumbnail"
          style={{ height: "250px", width: "450px" }}
          alt=''
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = ImageNotFound;
          }}
        />,
      sizeClass: "modal-dialog-centered"

    })
  }
  itinerarypreviewPopupData = () => {
    this.setState({
      title: "Itinerary Title Image",
      isShowPopup: true,
      body:
        <img src={this.state.data.imageURL}
          className="img-responsive img-thumbnail"
          style={{ height: "250px", width: "450px" }}
          alt=''
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = ImageNotFound;
          }}
        />,
      sizeClass: "modal-dialog-centered"

    })
  }
  handleHidePopup = () => {
    this.setState({
      isShowPopup: !this.state.isShowPopup,
      title: "",
      body: "",
      sizeClass: ""
    });
  };
  imageDetails = (imagename, url, extension) => {
    let data = this.state.data;
    data.ImageName = imagename;
    data.imageURL = url;
    data.imageExtension = extension;
    this.setState({ data, isShowPopup: false })
  }

  handleCreate = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.props.handleCreate(this.state.data);
  };

  setData = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    let quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));
    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName = this.props.mode === "Edit" ? this.props.customerName :
      bookingForInfo && bookingForInfo.firstName
        ? bookingForInfo.firstName + ' ' + (bookingForInfo.lastName ?? "")
        : this.props.customerName || "";

    defautData.email = this.props.mode === "Edit" ? this.props.email :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";
    defautData.address = this.props.mode === "Edit" ? this.props.address :
      bookingForInfo && bookingForInfo.address
        ? bookingForInfo.address
        : this.props.address || "";
    defautData.gstno = this.props.mode === "Edit" ? this.props.gstno :
      bookingForInfo && bookingForInfo.gstNumber
        ? bookingForInfo.gstNumber
        : this.props.gstno || "";
    defautData.userID = this.props.userID;
    defautData.phone = this.props.mode === "Edit" ? this.props.phone :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";

    defautData.phoneNotoValidate = defautData.phone;

    defautData.startDate = this.props.mode === "Edit" ? this.props.startDate :
      bookingForInfo && bookingForInfo.startDate
        ? bookingForInfo.startDate
        : this.props.startDate || new Date();

    defautData.endDate = this.props.mode === "Edit" ? this.props.endDate :
      bookingForInfo && bookingForInfo.endDate
        ? bookingForInfo.endDate
        : this.props.endDate || new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);

    defautData.followupDate = this.props.mode === "Edit" ? this.props.followupDate :
      bookingForInfo && bookingForInfo.followupDate
        ? bookingForInfo.followupDate
        : this.props.followupDate || new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);

    defautData.imageURL = this.props.mode === "Edit" ? this.props.imageURL :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.imageURL
        : this.props.imageURL || "";
    defautData.imageExtension = this.props.mode === "Edit" ? this.props.imageExtension :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.imageExtension
        : this.props.imageExtension || "";
    defautData.ImageName = this.props.mode === "Edit" ? this.props.ImageName :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.ImageName
        : this.props.ImageName || "";
    defautData.duration = this.GetDuration(defautData.startDate, defautData.endDate);
    defautData.adults = this.props.adult === undefined ? this.props.adults : this.props.adult;
    defautData.children = this.props.children;
    defautData.infant = this.props.infant;
    defautData.tripType = this.props.tripType;
    defautData.priority = this.props.priority;
    defautData.budget = this.props.budget;
    defautData.createdDate = this.props.mode === "Edit" ? this.props.createdDate :
      bookingForInfo && bookingForInfo.createdDate
        ? bookingForInfo.createdDate
        : this.props.createdDate || new Date();

    let configurations = this.props.mode === "Edit" ? quotationDetails?.configurations : this.state.data.configurations;
    defautData.configurations = configurations;
    if (configurations && this.props.type === "Quotation" || this.props.type === "Quotation_Master") {
      configurations["isShowTotalPrice"] = false;
    }

    if (!defautData.configurations)
      defautData.configurations = configurations ?? this.state.data.configurations;

    if (defautData.createdDate === "0001-01-01T00:00:00")
      defautData.createdDate = new Date();
    defautData.status = this.props?.status ? (this.props?.status.toLowerCase() === "booked" ? "Completed" : this.props.status) : "";
    defautData.userID = this.props.userId ?? this.state.data.userID;
    if (defautData.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
      defautData.email = "";
    defautData.isQuickProposal = this.props.isquickpropo;
    //defautData.budget = this.props.budget;
    this.setState({ data: defautData });
  };

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    newData.duration = this.GetDuration(startDate, endDate);
    this.setState({ data: newData });
  };

  GetDuration = (startDate, endDate) => {
    var tmpStartDate = moment([
      moment(startDate)._d.getFullYear(),
      moment(startDate)._d.getMonth(),
      moment(startDate)._d.getDate(),
    ]);
    var tmpEndDate = moment([
      moment(endDate)._d.getFullYear(),
      moment(endDate)._d.getMonth(),
      moment(endDate)._d.getDate(),
    ]);
    var totaldaysduration = tmpEndDate.diff(tmpStartDate, "days") + 1;
    return totaldaysduration;
  };

  handlePrices = (e) => {
    let quotationItems = localStorage.getItem("quotationItems")
      ? JSON.parse(localStorage.getItem("quotationItems"))
      : null;
    let target = e.target;
    if (target.name === "isPackagePricing") {
      if (target.checked === true) {
        if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
          quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem = { ...defaultPackagePricingData };
        }
        let configurations = Global.itineraryConfigurations;
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ShowhideElementname: "hideItemizedPrices",
              isShowTotalPrice: true,
              isShowItemizedPrice: false,
              isShowFlightPrices: false,
              isShowImage: preState.data.configurations.isShowImage,
              isHidePrice: true,
              isPackagePricing: true,
            },
            packagePricingData: { ...defaultPackagePricingData }
          }
        }));
      }
      else {
        if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
          quotationItems = quotationItems.filter(x => x.offlineItem.business !== "package");
        }
        let configurations = Global.itineraryConfigurations;
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ShowhideElementname: "showAllPrices",
              isShowTotalPrice: true,
              isShowItemizedPrice: true,
              isShowFlightPrices: true,
              isShowImage: preState.data.configurations.isShowImage,
              isHidePrice: true,
              isPackagePricing: false,
            },
            packagePricingData: undefined
          }
        }));
      }
    }
    else if (target.name === "isShowTotalPrice") {
      if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
        quotationItems = quotationItems.filter(x => x.offlineItem.business !== "package");
      }
      if (target.checked === true) {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowTotalPrice: true,
              isHidePrice: true,
              ShowhideElementname: this.state.data?.configurations?.isShowItemizedPrice === true ? "showAllPrices" : "hideItemizedPrices",
              isPackagePricing: false,
            }
          }
        }));
      } else {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowTotalPrice: false,
              isHidePrice: false,
              ShowhideElementname: (this.state.data?.configurations?.isShowItemizedPrice === true && "showAllPrices")
                || (this.state.data?.configurations?.isShowFlightPrices === true && "isShowFlightPrice"),
              isPackagePricing: false,
            }
          }
        }));
      }
    }
    if (target.name === "isShowItemizedPrice") {
      if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
        quotationItems = quotationItems.filter(x => x.offlineItem.business !== "package");
      }
      if (target.checked === true) {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowItemizedPrice: true,
              isShowFlightPrices: false,
              ShowhideElementname: "showAllPrices",
              isPackagePricing: false,
            }
          }
        }));
      } else {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowItemizedPrice: false,
              ShowhideElementname: this.state.data?.configurations?.isShowFlightPrices ? "isShowFlightPrice" : "hideItemizedPrices",
              isPackagePricing: false,
            }
          }
        }));
      }
    }
    if (target.name === "isHideFareBreakupInvoice") {
      if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
        quotationItems = quotationItems.filter(x => x.offlineItem.business !== "package");
      }
      if (target.checked === true) {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isHideFareBreakupInvoice: true
            }
          }
        }));
      }
      else {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isHideFareBreakupInvoice: false,
            }
          }
        }));
      }
    }
    if (target.name === "isShowFlightPrices") {
      if (quotationItems && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
        quotationItems = quotationItems.filter(x => x.offlineItem.business !== "package");
      }
      if (target.checked === true) {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowFlightPrices: true,
              isShowItemizedPrice: false,
              ShowhideElementname: "isShowFlightPrice",
              isPackagePricing: false,
            }
          }
        }));
      } else {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowFlightPrices: false,
              ShowhideElementname: this.state.data?.configurations?.isShowItemizedPrice === true ? "showAllPrices" : "hideItemizedPrices",
              isPackagePricing: false,
            }
          }
        }));
      }
    }
    if (quotationItems) {
      if (quotationItems.length === 0)
        localStorage.removeItem("quotationItems");
      else
        localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    }
    if (target.name === "isShowImage") {
      if (target.checked === true) {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowImage: true,
            }
          }
        }));
      }
      else {
        this.setState(preState => ({
          data: {
            ...preState.data,
            configurations: {
              ...preState.data.configurations,
              isShowImage: false,
            }
          }
        }));
      }
    }
  };
  componentDidMount() {
    this.getEmployees(this.setData);
  }
  getEmployees(callback) {
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

          let stateData = this.state.data;
          if (this.props.mode === "Edit") {
            stateData.userID = this.props.userID
          }
          else {
            stateData.userID = employeesOptions.find(x => x.isLoggedinEmployee)?.value ?? 0;
          }
          this.setState({ employeesOptions, isLoadingEmployees: false, data: stateData }, () => callback())
        }
        else {
          this.setState({ employeesOptions: [], isLoadingEmployees: false }, () => callback())
        }
      }.bind(this),
      "POST"
    );
  }
  removeImage = () => {
    let data = this.state.data;
    data.imageURL = ''
    this.setState({ data })
  }
  handleChangeAmount = () => {
    this.setState({
      isShowPopup: true,
      title: this.props?.isquickpropo ? "Quick Proposal Pricing" : "Package Pricing",
      body: <QuotationPackagePricing data={this.state.data.packagePricingData} budget={this.state.data.budget} handlePackageAmount={this.handlePackageAmount} />,
      sizeClass: "modal-dialog modal-lg modal-dialog-centered",
    });
  }
  handleChangeQuickProposalAmout = () => {
    let defaultpackagePricingData = defaultPackagePricingData;
    defaultpackagePricingData.sellPrice = this.state.data.budget;
    let data = this.state.data;
    data.packagePricingData = defaultpackagePricingData

    this.setState({ data });
  }
  changeCustomerType = (Type) => {
    let newData = { ...this.state.data };
    newData.bookingFor = Type;
    if (Type === "Corporate") {
      // if (Type === 'Corporate' && false) {
      this.setState({ data: newData });
    }
    else if (Type === "Individual") {
      this.setState({ data: newData });
    }
    else {
      this.setState({ isshowauthorizepopup: true })
    }
  };
  handlePackageAmount = (packagePricingData) => {
    if (this.props.mode !== "Edit") {
      localStorage.setItem("quotationItems", JSON.stringify([{ "offlineItem": packagePricingData }]));
    }
    else {
      let quotationItems = JSON.parse(localStorage.getItem("quotationItems"))
      if (!quotationItems) {
        quotationItems = [{ "offlineItem": packagePricingData }];
      }
      else if (quotationItems.find(x => x.offlineItem.business === "package")) {
        quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem = { ...packagePricingData };
      }
      else {
        quotationItems.push({ "offlineItem": packagePricingData });
      }
      quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem = { ...packagePricingData };
      localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    }
    let { data } = this.state;
    data.packagePricingData = packagePricingData;
    data.budget = packagePricingData.totalAmount
    this.setState({
      data,
      isShowPopup: false,
      title: "",
      body: "",
      sizeClass: "",
    });
  }
  handleCustomerChange = (bookingForInfo) => {
    let defautData = { ...this.state.data };
    defautData.customerName = (bookingForInfo && bookingForInfo.displayName) ?? '';
    defautData.email = bookingForInfo && bookingForInfo.contactInformation ? bookingForInfo.contactInformation.email : "";
    defautData.phone = bookingForInfo && bookingForInfo.contactInformation ? bookingForInfo.contactInformation.phoneNumber : "";
    this.setState({ data: defautData });
  }
  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    const { type } = this.props;
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    let editMode = this.props.mode === "Edit" ? true : false;
    const { employeesOptions } = this.state;
    const customStyles = {
      control: styles => ({ ...styles, textTransform: "capitalize" }),
      option: styles => ({ ...styles, textTransform: "capitalize" }),
      menu: styles => ({ ...styles, width: 'auto', 'min-width': '100%' }),
    };
    let isEnableEditPackage = false;
    let tripType = "Trip Type";
    let isEnablePackagePricingCheckbox = false;
    if (this.props.mode === "Edit" && localStorage.getItem("quotationItems")
      && JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package").length === 1) {
      isEnableEditPackage = (JSON.parse(localStorage.getItem("quotationItems"))?.length ?? 0) === 1
      isEnablePackagePricingCheckbox = (JSON.parse(localStorage.getItem("quotationItems"))?.length ?? 0) === 1;
    }
    else if (this.props.mode === "Edit" && localStorage.getItem("quotationItems")) {
      isEnableEditPackage = true;
      isEnablePackagePricingCheckbox = (JSON.parse(localStorage.getItem("quotationItems"))?.length ?? 0) === 0;
    }
    else if ((this.props.mode !== "Edit")) {
      isEnableEditPackage = true;
      isEnablePackagePricingCheckbox = true
    }
    else {
      isEnableEditPackage = true;
      isEnablePackagePricingCheckbox = true
    }
    this.props.childRef.current = this.state.data;
    return (
      <div className="quotation-create border p-3 mt-3 bg-white shadow-sm mb-3 position-relative">
        <div className="row">
          {(type === "Quotation" || type === "Quotation_Master") &&
            <React.Fragment>
              {type !== "Quotation_Master" &&
                <div className="col-md-3">
                  <div className="BE-Search-Radio pt-1">
                    <label className="d-block">Booking For Source</label>
                    {editMode ? <button className="btn btn-primary w-100 btn-sm">{this.state.data.bookingFor === '' ? 'Individual' : this.state.data.bookingFor}</button>
                      : <ul>
                        <li className="checked">
                          <input
                            checked={this.state.data.bookingFor === "Individual" ? true : false}
                            value="Individual"
                            name="Direction"
                            type="radio"
                            onChange={() => this.changeCustomerType("Individual")}
                          />
                          <label>Individual</label>
                        </li>
                        <li>
                          <input
                            value="Corporate"
                            name="Direction"
                            type="radio"
                            checked={this.state.data.bookingFor === "Corporate" ? true : false}
                            onChange={() => this.changeCustomerType("Corporate")}
                          />
                          <label>Corporate</label>
                        </li>
                      </ul>}
                  </div>
                </div>
              }
            </React.Fragment>
          }
          {(type === "Quotation" || type === "Quotation_Master") && (
            <React.Fragment>
              {type !== "Quotation_Master" &&
                <div className="col-md-6">
                  {this.state.data.bookingFor === "Individual"
                    ? <div className="col-md-12">
                      <CustomerAddSelect
                        key={"Customer"}
                        labelName="Individual"
                        isReadOnly={editMode}
                        userInfo={this.props.userInfo}
                        errors={this.state.errors}
                        handleChange={this.handleCustomerChange}
                        selectedCustomer={editMode
                          ? {
                            "name": this.props.customerName,
                            "contactInformation": {
                              "email": this.props.email,
                              "phoneNumber": this.props.phone
                            }
                          }
                          : null}
                      />
                    </div>
                    : <div className="col-md-12">
                      <CustomerAddSelect
                        key={"Corporate"}
                        labelName="Corporate"
                        isReadOnly={editMode}
                        userInfo={this.props.userInfo}
                        errors={this.state.errors}
                        handleChange={this.handleCustomerChange}
                        selectedCustomer={editMode
                          ? {
                            "name": this.props.customerName,
                            "contactInformation": {
                              "email": this.props.email,
                              "phoneNumber": this.props.phone
                            }
                          }
                          : null}
                      />
                    </div>
                  }
                </div>}
              <div className='col-md-3'>
                {this.renderInput("title", Trans("_quotationTitleWithStar").replace("##Quotation##", Trans("_quotationReplaceKey")))}
              </div>
              <div class="col-md-2">
                {type === 'Quotation_Master' && <label>{Trans("_quotationReplaceKey")} Image</label>}
                <div className={type !== 'Quotation_Master' ? "row m-0 mt-4" : "row m-0"}>
                  <button class={type !== 'Quotation_Master'
                    ? "btn d-flex justify-content-center mt-2"
                    : "btn d-flex justify-content-center"}
                    style={{
                      border: "2px solid #DDD8D7",
                      width: "100%",
                      marginRight: "2px"
                    }} onClick={() => this.uploadPopupData()}>Select Image</button>
                  {this.state.data.imageURL &&
                    <div className="btn-group">
                      <small class="btn alert alert-success mt-2 p-1 d-inline-block"
                        onClick={() => this.itinerarypreviewPopupData()}>
                        Preview Image
                      </small>
                      <small
                        className="btn btn-sm alert alert-success p-1 mt-2"
                        onClick={() => this.removeImage()}
                        data-toggle="tooltip" data-placement="top"
                        title="Remove"
                      >
                        <img
                          style={{ filter: "none" }}
                          src={trashImage}
                          alt=""
                        />
                      </small>
                    </div>
                  }
                </div>
              </div>

              <div className="col-md-2">
                {this.renderCurrentDateWithDuration("startDate", (this.state.data.inquiryType.toLowerCase() === 'air' || this.state.data.inquiryType.toLowerCase() === 'rail') ? "Departure Date" : this.state.data.inquiryType.toLocaleLowerCase() === 'hotel' ? "Check In" : this.state.data.inquiryType.toLowerCase() === "visa" ? "Travel Date" : (this.state.data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rent a car') ? "Pickup Date" : "Start Date", moment('2001-01-01').format('YYYY-MM-DD'))}
              </div>
              <div className="col-md-2">
                {this.renderCurrentDateWithDuration("endDate", (this.state.data.inquiryType.toLowerCase() === 'air' || this.state.data.inquiryType.toLowerCase() === 'rail') ? "Departure Date" : this.state.data.inquiryType.toLocaleLowerCase() === 'hotel' ? "Check In" : this.state.data.inquiryType.toLowerCase() === "visa" ? "Travel Date" : (this.state.data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rent a car') ? "Pickup Date" : "End Date", moment('2001-01-01').format('YYYY-MM-DD'))}
              </div>
              <div className="col-md-3">
                {this.renderSelect("tripType", tripType,
                  this.state.data.inquiryType.toLowerCase() === "visa" ? tripTypeListVisa
                    : tripTypeList
                )}
              </div>
              <div className="col-md-1">{this.renderInput("adults", "Adults")}</div>
              <div className="col-md-1">{this.renderInput("children", "Children")}</div>
              <div className="col-md-1">{this.renderInput("infant", this.state.data.inquiryType.toLowerCase() === 'visa' ? "Infant" : "Infant(s)")}</div>
              <div class={type === 'Quotation_Master' ? 'col-md-2' : 'col-md-2'}>
                {this.renderInput("budget", this.state.data.inquiryType.toLowerCase() === 'forex' ? "Amount" : "Budget (" + portalCurrency + ")", "Amit")}
              </div>
              <div className="col-md-2">
                {this.renderCurrentDateWithDuration("followupDate", "Followup Date", moment(this.state.data.startDate).isSameOrBefore(moment(), "day") ? this.state.data.startDate : moment().format('YYYY-MM-DD'))
                }
              </div>



              {type !== "Itinerary_Master" && type !== "Quotation_Master" &&
                <div className={(type === "Quotation" && this.props.mode === "Create") ? "col-md-3" : "col-md-2"}>
                  <div className={"form-group"}>
                    <label htmlFor={"employees"}>{"Assigned To"}</label>
                    <Select
                      styles={customStyles}
                      placeholder="Select Employee..."
                      id={"employees"}
                      defaultValue={employeesOptions.find(x => x.isLoggedinEmployee || x.isLoggedinEmployee === 1)}
                      value={employeesOptions.find(x => x.value === this.state.data.userID)}
                      options={employeesOptions}
                      onChange={(e) => {
                        this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                      }}
                      noOptionsMessage={() => "No employee(s) available"}
                      isLoading={this.state.isLoadingEmployees}
                    />
                  </div>
                </div>}
              <div className="col-md-2">
                <div className={"form-group"}>
                  <label htmlFor={"priority"}>{"Priority"}</label>
                  <Select
                    styles={customStyles}
                    placeholder="Select priority..."
                    id={"priority"}
                    value={prioritylist.find(x => x.value === this.state.data.priority)}
                    options={prioritylist}
                    onChange={(e) => {
                      this.handleChange({ currentTarget: { value: e.value, name: "priority" } })
                    }}
                    noOptionsMessage={() => "No priority(s) available"}
                    isLoading={this.state.isLoadingEmployees}
                  />
                </div>
              </div>
              {type === 'Quotation_Master' &&
                <React.Fragment>
                  <div className="col-md-2">
                    {this.renderSelect("status", "Status", statusList)}
                  </div>
                  <div className="col-md-2 d-none">
                    {this.renderInput("budget", "Price")}
                  </div>
                </React.Fragment>
              }

              {type !== 'Quotation_Master' &&
                <React.Fragment>
                  <div className="col-md-2 ">
                    {this.renderSelect("status", "Status", statusList)}
                  </div>
                  {this.props.isquickpropo && this.state.data.budget > 0 &&
                    <div className="col-md-2">
                      {this.renderInput("budget", "Sell Price", null, true, this.handleChangeQuickProposalAmout)}
                    </div>
                  }
                </React.Fragment>
              }
              {(this.props.mode !== "CreateQuick") &&
                <div class="col-md-6 d-none">
                  <small>
                    <div className="custom-control custom-checkbox d-inline-block mr-2 mb-2">
                      <input
                        id="isHideFareBreakupInvoice"
                        name="isHideFareBreakupInvoice"
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.data?.configurations?.isHideFareBreakupInvoice}
                        onChange={this.handlePrices}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="isHideFareBreakupInvoice"
                      >
                        Hide Fare Breakup In Invoice
                      </label>
                    </div>
                  </small>
                </div>}
              {this.props.mode === "CreateQuick" &&
                <div class="col-md-2 mt-3 d-none">
                  <small>
                    <div className="custom-control custom-checkbox d-inline-block mr-2 mb-2">
                      <input
                        id="isHideFareBreakupInvoice"
                        name="isHideFareBreakupInvoice"
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.data?.configurations?.isHideFareBreakupInvoice}
                        onChange={this.handlePrices}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="isHideFareBreakupInvoice"
                      >
                        Hide Fare Breakup In Invoice
                      </label>
                    </div>
                  </small>
                </div>}
              {/* {(this.props.mode !== "Create" &&
                ((this.props?.userID === undefined ? this.props.userId : this.props.userID) !== this.state.data.userID
                  || this.props?.status !== this.state.data.status
                  || this.props?.followupDate.slice(0, 10) !== this.state.data.followupDate.slice(0, 10)))
                && <div className="col-md-12">
                  {this.renderTextarea("assignmentComment", "Comments *")}
                </div>
              } */}
              {type === 'Quotation_Master' &&
                <div className="col-md-12 d-flex justify-content-end pr-0">
                  <div className={type === 'Quotation_Master' ? "col-md-3" : "col-md-3 mt-4"}>
                    {this.props.isBtnLoading &&
                      <button className="btn btn-primary form-control mt-2">
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                        {this.props.type === "Quotation_Master" &&
                          (this.props.title ? Trans("_update") : Trans("_create")) + " Master " + (Trans("_quotationReplaceKey"))}
                        {this.props.type === "Quotation" &&
                          (this.props.customerName ? Trans("_update") : Trans("_create")) + " " + (Trans("_quotationReplaceKey"))}
                      </button>
                    }
                    {!this.props.isBtnLoading &&
                      <button onClick={this.handleCreate} className="btn btn-primary form-control mt-2">
                        {this.props.type === "Quotation_Master" &&
                          (this.props.title ? Trans("_update") : Trans("_create")) + " Master " + (Trans("_quotationReplaceKey"))}
                        {this.props.type === "Quotation" &&
                          (this.props.customerName ? Trans("_update") : Trans("_create")) + " " + (Trans("_quotationReplaceKey"))}
                      </button>
                    }
                  </div>
                </div>}
              {type !== 'Quotation_Master' && this.props?.status?.toLocaleLowerCase() !== "booked" &&
                <div className={type !== 'Quotation_Master'
                  ? (this.props.isquickpropo
                    ? "col-md-12 d-flex justify-content-end pr-0 mt-4" : "col-md-12 d-flex justify-content-end pr-0")
                  : "col-md-6 d-flex justify-content-end pr-0"}>
                  {/* <div className={type !== 'Quotation_Master'
                ? "col-md-4 d-flex justify-content-end pr-0 mt-4"
                : "col-md-6 d-flex justify-content-end pr-0"}> */}
                  {this.props.isquickpropo &&
                    <React.Fragment>
                      <div className="col-md-6"></div>
                      <div className="col-md-3">
                        <button
                          className="btn btn-primary form-control"
                          onClick={this.handleChangeAmount}
                        >Quick Proposal Pricing</button>
                      </div>
                    </React.Fragment>
                  }
                  {!this.props.isquickpropo &&
                    <div className={this.props.isquickpropo ? "col-md-3" : "col-md-3"}>
                      {this.props.isBtnLoading &&
                        <button className="btn btn-primary form-control ">
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          {this.props.customerName ? Trans("_update") : Trans("_create")} {this.props.mode === "CreateQuick" ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")}
                        </button>
                      }
                      {!this.props.isBtnLoading &&
                        <button onClick={this.handleCreate} className="btn btn-primary form-control">
                          {this.props.customerName ? Trans("_update") : Trans("_create")} {this.props.mode === "CreateQuick" ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")}
                        </button>
                      }
                    </div>
                  }
                </div>}
              {this.props.isErrorMsg && (
                <div className="col-lg-12">
                  <h6 className="alert alert-danger mt-3 d-inline-block">
                    {this.props.isErrorMsg}
                  </h6>
                </div>
              )}
            </React.Fragment>
          )}
          {(type === "Itinerary" || type === "Itinerary_Master") && (
            <React.Fragment>
              {type !== "Itinerary_Master" &&
                <React.Fragment>
                  <div className="col-md-3">
                    <div className="BE-Search-Radio pt-1">
                      <label className="d-block">Booking For Source</label>
                      {editMode ? <button className="btn btn-primary w-100 btn-sm">{this.state.data.bookingFor === '' ? 'Individual' : this.state.data.bookingFor}</button>
                        : <ul>
                          <li className="checked">
                            <input
                              checked={this.state.data.bookingFor === "Individual" ? true : false}
                              value="Individual"
                              name="Direction"
                              type="radio"
                              onChange={() => this.changeCustomerType("Individual")}
                            />
                            <label>Individual</label>
                          </li>
                          <li>
                            <input
                              value="Corporate"
                              name="Direction"
                              type="radio"
                              checked={this.state.data.bookingFor === "Corporate" ? true : false}
                              onChange={() => this.changeCustomerType("Corporate")}
                            />
                            <label>Corporate</label>
                          </li>
                        </ul>}
                    </div>
                  </div>
                  <div className="col-md-5">
                    {this.state.data.bookingFor === "Individual"
                      ? <div className="col-md-12">
                        <CustomerAddSelect
                          key={"Customer"}
                          labelName="Individual"
                          isReadOnly={editMode}
                          userInfo={this.props.userInfo}
                          errors={this.state.errors}
                          handleChange={this.handleCustomerChange}
                          selectedCustomer={editMode
                            ? {
                              "name": this.props.customerName,
                              "contactInformation": {
                                "email": this.props.email,
                                "phoneNumber": this.props.phone
                              }
                            }
                            : null}
                        />
                      </div>
                      : <div className="col-md-12">
                        <CustomerAddSelect
                          key={"Corporate"}
                          labelName="Corporate"
                          isReadOnly={editMode}
                          userInfo={this.props.userInfo}
                          errors={this.state.errors}
                          handleChange={this.handleCustomerChange}
                          selectedCustomer={editMode
                            ? {
                              "name": this.props.customerName,
                              "contactInformation": {
                                "email": this.props.email,
                                "phoneNumber": this.props.phone
                              }
                            }
                            : null}
                        />
                      </div>
                    }
                  </div>
                  <div className="col-md-4">
                    {this.renderInput("title", Trans("Itinerary Title *"))}
                  </div>
                  <div class="col-md-2">
                    <lable>&nbsp;</lable>
                    <div class="row m-0">
                      <button class="btn d-flex justify-content-center mt-2"
                        style={{
                          border: "2px solid #DDD8D7",
                          width: "100%",
                          marginRight: "2px"
                        }} onClick={() => this.uploadPopupData()}>Select Image</button>
                      {this.state.data.imageURL &&
                        <div className="btn-group">
                          <small class="btn alert alert-success mt-2 p-1 d-inline-block"
                            onClick={() => this.itinerarypreviewPopupData()}>
                            Preview Image
                          </small>
                          <small
                            className="btn btn-sm alert alert-success p-1 mt-2"
                            onClick={() => this.removeImage()}
                            data-toggle="tooltip" data-placement="top"
                            title="Remove"
                          >
                            <img
                              style={{ filter: "none" }}
                              src={trashImage}
                              alt=""
                            />
                          </small>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="col-lg-2">
                    {this.renderCurrentDateWithDuration("startDate", Trans("_fromDate"), moment('2001-01-01').format('YYYY-MM-DD'))}
                  </div>

                  <div className="col-lg-2">
                    {this.renderCurrentDateWithDuration("endDate", Trans("_toDate"), this.state.data.startDate)}
                  </div>

                  <div className="col-lg-2">
                    {this.renderInput("duration", Trans("Duration (Days)"), "text", true)}
                  </div>
                  <div className="col-md-3">
                    {this.renderSelect("tripType", tripType,
                      this.state.data.inquiryType.toLowerCase() === "visa" ? tripTypeListVisa
                        : tripTypeList
                    )}
                  </div>
                  <div className="col-md-1">{this.renderInput("adults", "Adults")}</div>
                  <div className="col-md-1">{this.renderInput("children", "Children")}</div>
                  <div className="col-md-1">{this.renderInput("infant", this.state.data.inquiryType.toLowerCase() === 'visa' ? "Infant" : "Infant(s)")}</div>
                  <div class={type === 'Quotation_Master' ? 'col-md-2' : 'col-md-2'}>
                    {this.renderInput("budget", this.state.data.inquiryType.toLowerCase() === 'forex' ? "Amount" : "Budget (" + portalCurrency + ")", "Amit")}
                  </div>
                  <div className="col-md-2">
                    {this.renderCurrentDateWithDuration("followupDate", "Followup Date", moment(this.state.data.startDate).isSameOrBefore(moment(), "day") ? this.state.data.startDate : moment().format('YYYY-MM-DD'))
                    }
                  </div>
                  {type !== "Itinerary_Master" && type !== "Quotation_Master" &&
                    <div className={type === "Itinerary" ? "col-md-2" : "col-md-3"}>
                      <div className={"form-group"}>
                        <label htmlFor={"employees"}>{"Assigned To"}</label>
                        <Select
                          styles={customStyles}
                          placeholder="Select Employee..."
                          id={"employees"}
                          defaultValue={employeesOptions.find(x => x.isLoggedinEmployee)}
                          value={employeesOptions.find(x => x.value === this.state.data.userID)}
                          options={employeesOptions}
                          onChange={(e) => {
                            this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                          }}
                          noOptionsMessage={() => "No employee(s) available"}
                          isLoading={this.state.isLoadingEmployees}
                        />
                      </div>
                    </div>}
                  <div className="col-md-2">
                    <div className={"form-group"}>
                      <label htmlFor={"priority"}>{"Priority"}</label>
                      <Select
                        styles={customStyles}
                        placeholder="Select priority..."
                        id={"priority"}
                        value={prioritylist.find(x => x.value === this.state.data.priority)}
                        options={prioritylist}
                        onChange={(e) => {
                          this.handleChange({ currentTarget: { value: e.value, name: "priority" } })
                        }}
                        noOptionsMessage={() => "No priority(s) available"}
                        isLoading={this.state.isLoadingEmployees}
                      />
                    </div>
                  </div>
                </React.Fragment>}
              {type !== "Itinerary" &&
                <div className="col-lg-5">
                  {this.renderInput("title", Trans("Itinerary Title *"))}
                </div>}

              {type === "Itinerary_Master" &&
                <React.Fragment>
                  <div class={type === 'Itinerary_Master' ? "col-lg-2" : "col-lg-2 mt-4"}>
                    <div class="row m-0 mt-1">
                      <button class="btn d-flex justify-content-center mb-2 mt-4"
                        // <button class="btn d-flex justify-content-center mb-2" 
                        style={{
                          border: "2px solid #DDD8D7",
                          width: "100%"
                        }} onClick={() => this.uploadPopupData()}>Select Image</button>
                      {this.state.data.imageURL &&
                        <div className="btn-group">
                          <small class="btn alert alert-success mt-2 p-1 d-inline-block"
                            onClick={() => this.itinerarypreviewPopupData()}>
                            Preview Image
                          </small>
                          <small
                            className="btn btn-sm alert alert-success p-1 mt-2"
                            onClick={() => this.removeImage()}
                            data-toggle="tooltip" data-placement="top"
                            title="Remove"
                          >
                            <img
                              style={{ filter: "none" }}
                              src={trashImage}
                              alt=""
                            />
                          </small>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {this.renderSelect("tripType", tripType,
                      this.state.data.inquiryType.toLowerCase() === "visa" ? tripTypeListVisa
                        : tripTypeList
                    )}
                  </div>
                  <div className="col-lg-2">
                    {this.renderCurrentDateWithDuration("startDate", Trans("_fromDate"), moment('2001-01-01').format('YYYY-MM-DD'))}
                  </div>

                  <div className="col-lg-2">
                    {this.renderCurrentDateWithDuration("endDate", Trans("_toDate"), this.state.data.startDate)}
                  </div>

                  <div className="col-lg-2">
                    {this.renderInput("duration", Trans("Duration (Days)"), "text", true)}
                  </div>
                  <div className="col-lg-1">{this.renderInput("adults", "Adults")}</div>
                  <div className="col-lg-1">{this.renderInput("children", "Children")}</div>
                  <div className="col-lg-1">{this.renderInput("infant", this.state.data.inquiryType.toLowerCase() === 'visa' ? "Infant" : "Infant(s)")}</div>
                  <div class={type === 'Quotation_Master' ? 'col-lg-2' : 'col-lg-3'}>
                    {this.renderInput("budget", this.state.data.inquiryType.toLowerCase() === 'forex' ? "Amount" : "Budget (" + portalCurrency + ")", "Amit")}
                  </div>
                  <div className="col-lg-2">
                    {this.renderCurrentDateWithDuration("followupDate", "Followup Date", moment(this.state.data.startDate).isSameOrBefore(moment(), "day") ? this.state.data.startDate : moment().format('YYYY-MM-DD'))
                    }
                  </div>
                  <div className="col-lg-2">
                    <div className={"form-group"}>
                      <label htmlFor={"priority"}>{"Priority"}</label>
                      <Select
                        styles={customStyles}
                        placeholder="Select priority..."
                        id={"priority"}
                        value={prioritylist.find(x => x.value === this.state.data.priority)}
                        options={prioritylist}
                        onChange={(e) => {
                          this.handleChange({ currentTarget: { value: e.value, name: "priority" } })
                        }}
                        noOptionsMessage={() => "No priority(s) available"}
                        isLoading={this.state.isLoadingEmployees}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    {this.renderSelect("status", "Status", statusList)}
                  </div>
                </React.Fragment>}
              {type !== "Itinerary_Master" && type !== "Quotation_Master" &&
                <React.Fragment>
                  <div className="col-md-2">
                    {this.renderSelect("status", "Status", statusList)}
                  </div>
                  <div className="col-md-2 d-none">
                    {this.renderInput("budget", "Price")}
                  </div>
                </React.Fragment>
              }
              {isEnableEditPackage && <React.Fragment>
                <div class={type === "Itinerary_Master" ? "col-md-2 mt-4" : "col-md-2"}>
                  <div className={type === "Itinerary_Master"
                    ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-2"
                    : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                    <input
                      id="isShowTotalPrice"
                      name="isShowTotalPrice"
                      type="checkbox"
                      className="custom-control-input"
                      checked={this.state.data?.configurations?.isShowTotalPrice}
                      onChange={this.handlePrices}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="isShowTotalPrice"
                    >
                      Show Total Prices
                    </label>
                  </div>
                </div>
                <div class={type === "Itinerary_Master" ? "col-md-2 mt-2" : "col-md-2"}>
                  <div className={type === "Itinerary_Master"
                    ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-4"
                    : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                    <input
                      id="isShowItemizedPrice"
                      name="isShowItemizedPrice"
                      type="checkbox"
                      className="custom-control-input"
                      checked={this.state.data?.configurations?.isShowItemizedPrice}
                      onChange={this.handlePrices}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="isShowItemizedPrice"
                    >
                      Show Itemized Prices
                    </label>
                  </div>
                </div>
                <div class={type === "Itinerary_Master" ? "col-md-2 mt-2" : "col-md-2"}>
                  <div className={type === "Itinerary_Master"
                    ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-4"
                    : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                    <input
                      id="isShowFlightPrices"
                      name="isShowFlightPrices"
                      type="checkbox"
                      className="custom-control-input"
                      checked={this.state.data?.configurations?.isShowFlightPrices}
                      onChange={this.handlePrices}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="isShowFlightPrices"
                    >
                      Show Flight Prices
                    </label>
                  </div>
                </div>
              </React.Fragment>}
              <div class={type === "Itinerary_Master" ? "col-md-2 mt-2" : "col-md-2"}>
                <div className={type === "Itinerary_Master"
                  ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-4"
                  : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                  <input
                    id="isShowImage"
                    name="isShowImage"
                    type="checkbox"
                    className="custom-control-input"
                    checked={this.state.data?.configurations?.isShowImage}
                    onChange={this.handlePrices}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="isShowImage"
                  >
                    Show Images
                  </label>
                </div>
              </div>
              <div className="col-md-2 d-none">
                <small>
                  <div className={type === "Itinerary_Master"
                    ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-2"
                    : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                    <input
                      id="isHideFareBreakupInvoice"
                      name="isHideFareBreakupInvoice"
                      type="checkbox"
                      className="custom-control-input"
                      checked={this.state.data?.configurations?.isHideFareBreakupInvoice}
                      onChange={this.handlePrices}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="isHideFareBreakupInvoice"
                    >
                      Hide Fare Breakup In Invoice
                    </label>
                  </div>
                </small>
              </div>
              {isEnablePackagePricingCheckbox &&
                <div class={type === "Itinerary_Master" ? "col-md-2" : "col-md-2"}>
                  <small>
                    <div className={type === "Itinerary_Master"
                      ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-2"
                      : "custom-control custom-checkbox d-inline-block mr-2 mb-2"}>
                      <input
                        id="isPackagePricing"
                        name="isPackagePricing"
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.data?.configurations?.isPackagePricing}
                        onChange={this.handlePrices}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="isPackagePricing"
                      >
                        Enable Package Pricing
                      </label>
                    </div>
                  </small>
                </div>
              }

              {this.state.data?.configurations?.isPackagePricing &&
                <div class="col-md-2">
                  <button
                    className="btn btn-primary form-control"
                    onClick={this.handleChangeAmount}
                  >Package Pricing</button>
                </div>
              }
              {/* {(this.props.userId !== this.state.data.userID
                || this.props.status !== this.state.data.status)
                && <div className="col-md-12">
                  {this.renderTextarea("assignmentComment", "Comments *")}
                </div>
              } */}
              {this.props?.status?.toLocaleLowerCase() !== "booked" &&
                <div className="col-md-12">
                  <div className="row">
                    <div className={this.props.type === "Itinerary_Master" ? "col-md-9" : "col-md-9"}></div>
                    <div className={this.props.type === "Itinerary_Master" ? "col-md-3" : "col-md-3"}>
                      {this.props.isBtnLoading &&
                        <button className="btn btn-primary form-control">
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          {this.props.type === "Itinerary_Master" &&
                            (this.props.title ? Trans("_update") : Trans("_create")) + " Master " + "Itinerary"}
                          {this.props.type === "Itinerary" &&
                            (this.props.customerName ? Trans("_update") : Trans("_create")) + " " + "Itinerary"}
                        </button>
                      }
                      {!this.props.isBtnLoading &&
                        <button onClick={this.handleCreate} className="btn btn-primary form-control">
                          {this.props.type === "Itinerary_Master" &&
                            (this.props.title ? Trans("_update") : Trans("_create")) + " Master " + "Itinerary"}
                          {this.props.type === "Itinerary" &&
                            (this.props.customerName ? Trans("_update") : Trans("_create")) + " " + "Itinerary"}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
              {this.props.isErrorMsg && (
                <div className="col-lg-12">
                  <h6 className="alert alert-danger mt-3 d-inline-block">
                    {this.props.isErrorMsg}
                  </h6>
                </div>
              )}
            </React.Fragment>
          )}
        </div>

        {this.props.customerName && !this.props.removedeletebutton && (
          <button
            className="btn btn-sm position-absolute p-1 border-left border-bottom rounded-0 bg-light"
            style={{ top: "0px", right: "0px" }}
            onClick={(e) => this.props.history.push("/" + type + "/Details")}
          >
            <SVGIcon
              name="times"
              width="16"
              height="16"
              className="d-flex align-items-center text-secondary"
            ></SVGIcon>
          </button>
        )}
        {this.state.isShowPopup &&
          <ModelPopup
            header={this.state.title}
            content={this.state.body}
            sizeClass={this.state.sizeClass}
            handleHide={this.handleHidePopup}
          />
        }
      </div>
    );
  }
}

export default QuotationCreate;

const statusList = [
  { name: "New", value: "New" },
  { name: "Assigned", value: "Assigned" },
  { name: "Follow Up", value: "Follow Up" },
  { name: "Query", value: "Query" },
  { name: "Lost", value: "Lost" },
  { name: "Closed", value: "Closed" },
  { name: "Completed", value: "Completed" },
];

const tripTypeList = [
  { name: "Select Trip Type", value: "" },
  { name: "Domestic", value: "Domestic" },
  { name: "International", value: "International" },
  { name: "Both", value: "Both" },
];

const tripTypeListVisa = [
  { name: "Select Category", value: "" },
  { name: "Student", value: "Student" },
  { name: "Tourist", value: "Tourist" },
  { name: "Educational", value: "Educational" },
  { name: "Visitor", value: "Visitor" },
  { name: "Business", value: "Business" },
  { name: "Employment Visa", value: "Employment Visa" },
  { name: "Conference", value: "Conference" },
  { name: "Visa on Arrival", value: "Visa on Arrival" },
  { name: "Other", value: "Other" },
];

const prioritylist = [
  { label: "Select", value: "" },
  { label: "High", value: "High" },
  { label: "Moderate", value: "Moderate" },
  { label: "Low", value: "Low" },
];
const defaultPackagePricingData = {
  business: "package",
  fromLocation: "",
  fromLocationName: "",
  fromLocationCity: "",
  toLocation: "",
  toLocationName: "",
  toLocationCity: "",
  name: "",
  startDate: moment().add(1, "days").format('YYYY-MM-DD'),
  endDate: "",
  costPrice: "0",
  sellPrice: "0",
  vendor: "",
  brn: "",
  itemType: "",
  noRooms: "",
  rating: "",
  duration: "",
  guests: "",
  adult: "",
  child: "",
  infant: "",
  pickupType: "",
  dropoffType: "",
  pickupTime: "",
  departStartDate: "",
  departEndDate: "",
  departStartTime: "",
  departEndTime: "",
  departAirlineName: "",
  departFlightNumber: "",
  departClass: "",
  departStops: "",
  departDurationH: "",
  departDurationM: "",
  totaldepartduration: "",
  returnStartDate: "",
  returnEndDate: "",
  returnStartTime: "",
  returnEndTime: "",
  returnAirlineName: "",
  returnFlightNumber: "",
  returnClass: "",
  returnStops: "",
  totalreturnDuration: "",
  returnDurationH: "",
  returnDurationM: "",
  isRoundTrip: true,
  uuid: "",
  day: 1,
  toDay: 1,
  nights: 1,
  hotelPaxInfo: [
    {
      roomID: 1,
      noOfAdults: 2,
      noOfChild: 0,
      roomType: "",
      childAge: []
    }
  ],
  dayDepart: 1,
  dayDepartEnd: 1,
  dayReturn: 1,
  dayReturnEnd: 1,
  dates: {
    checkInDate: moment()
      .add(Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1, 'days')
      .format(Global.DateFormate),
    checkOutDate: moment()
      .add(Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1
        + Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.stayInDays ?? 1, 'days')
      .format(Global.DateFormate)
  },
  datesIsValid: "valid",
  cutOffDays: Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1,
  stayInDays: Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.stayInDays ?? 1,
  description: "",
  supplierCurrency: "",
  conversionRate: "",
  bookBefore: "",
  supplierCostPrice: "",
  supplierTaxPrice: "",
  markupPrice: "",
  discountPrice: "",
  CGSTPrice: 0,
  IGSTPrice: 0,
  SGSTPrice: 0,
  amountWithoutGST: 0,
  isInclusive: false,
  percentage: (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
  processingFees: 0,
  tax1: 0,
  tax2: 0,
  tax3: 0,
  tax4: 0,
  tax5: 0,
  taxType: "CGSTSGST",
  totalAmount: 0,
  mealType: "",
  hotelContactNumber: "",
  isShowTax: false,
  isSellPriceReadonly: false,
  tpExtension: [],
  customitemType: "",
  otherType: "",
  type: "itinerary",
  ImageName: 'Select Image',
  ImageUrl: '',
  ImgExtension: '',
  isTax1Modified: false,
  isTax2Modified: false,
  isTax3Modified: false,
  isTax4Modified: false,
  isTax5Modified: false,
};