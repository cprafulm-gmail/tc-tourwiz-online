import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import SVGIcon from "../helpers/svg-icon";
import UmrahPackageCreate from "../components/umrah-package/umrah-package-create";
import UmrahPackageinfo from "../components/umrah-package/umrah-package-info";
import UmrahPackageResults from "../components/umrah-package/umrah-package-results";
import UmrahPackageDetails from "../components/umrah-package/umrah-package-details";
import UmrahPackageSearch from "../components/umrah-package/umrah-package-search";
import UmrahPackageEmail from "../components/umrah-package/umrah-package-email";
import { Trans } from "../helpers/translate";
import UmrahPackageItineraryDetails from "../components/umrah-package/umrah-package-itinerary-details";
import ItineraryEmail from "../components/umrah-package/umrah-package-itinerary-email";
import UmrahPackageItineraryAddOffline from "../components/umrah-package/umrah-package-itinerary-add-offline";
import ComingSoon from "../helpers/coming-soon";
import { UmrahPackageGetItem } from "../components/umrah-package/umrah-package-get-cart-item";
import * as DropdownList from "../helpers/dropdown-list";
import UmrahPackageFlightDetails from "../components/umrah-package/umrah-package-flight-details";

class Umrahpackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: "",
      isResults: false,
      resultKey: 1,
      items: JSON.parse(localStorage.getItem("umrahPackageItems"))
        ? JSON.parse(localStorage.getItem("umrahPackageItems"))
        : [],
      isEmail: false,
      detailsKey: 1,
      isSaveSucessMsg: false,
      isBtnLoading: false,
      type: this.props.match.path.split("/").includes("umrah-package")
        ? "umrah-package"
        : "Quotation",
      importItem: false,
      importItemKey: 1,
      isShowSearch: true,
      comingsoon: false,
      validationMessage: [],
      isShowFlightDetails: false
    };
  }

  generateQuotation = (data) => {
    this.props.history.push("/" + this.state.type + "/Details");
    localStorage.setItem("umrahPackageDetails", JSON.stringify(data));
    this.clearCart();
    //localStorage.removeItem("umrahPackageDetails");
    localStorage.removeItem("umrahPackageItems");
    this.setState({
      isResults: false,
      items: JSON.parse(localStorage.getItem("umrahPackageItems"))
        ? JSON.parse(localStorage.getItem("umrahPackageItems"))
        : [],
      validationMessage: []
    });
    if (this.state.type !== "umrah-package")
      this.props.match.params.mode === "Create" && this.createCart();
  };

  clearCart = () => {
    var reqURL = "api/v1/cart/clear";
    var reqOBJ = {
      Request: {
        CartID: localStorage.getItem("cartLocalId"),
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
      }.bind(this)
    );
  };

  createCart = () => {
    const quotationInfo = JSON.parse(localStorage.getItem("umrahPackageDetails"));
    let reqURL = "quotation";
    let reqOBJ = {
      name: quotationInfo.title,
      owner: quotationInfo.customerName,
      isPublic: true,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms,
        offlineItems: localStorage.getItem("umrahPackageItems"),
        duration: quotationInfo.duration,
        startDate: quotationInfo.startDate,
        endDate: quotationInfo.endDate,
        type: this.state.type,
        createdDate: quotationInfo.createdDate,
        status: "saved",
        agentName: localStorage.getItem("agentName") || "",
      },
    };
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.id);
      this.setState({
        savedCartId: localStorage.getItem("cartLocalId"),
      });
      let localQuotationInfo = JSON.parse(
        localStorage.getItem("umrahPackageDetails")
      );
      localQuotationInfo.status = "saved";
      localStorage.setItem(
        "umrahPackageDetails",
        JSON.stringify(localQuotationInfo)
      );
    });
  };

  handleEdit = () => {
    this.props.history.push("/" + this.state.type + "/Edit");
  };

  handleResults = (businessName) => {
    this.setState({
      isSearch: false,
      isResults: true,
      businessName: businessName,
    });
  };

  handleSearchRequest = (searchParam) => {
    this.setState({
      searchRequest: searchParam,
      resultKey: this.state.resultKey + 1,
      isResults: true,
    });
    this.handleResults(searchParam.businessName);
  };

  deleteResults = () => {
    this.setState({ isResults: false });
  };

  bookUmrahPackage = () => {
    var umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"));
    var umrahPackageItems = JSON.parse(localStorage.getItem("umrahPackageItems"));
    let validationMessage = [];

    let travelTo = DropdownList.LookupTravelTo.find(x => x.value === umrahPackageDetails.umrahTravelTo);
    let FlightArrival = travelTo.arrivalAirLocationCode !== "";
    let FlightDeparture = travelTo.departureAirLocationCode !== "";
    let HotelMakkah = travelTo.hotelLocationCode1 === "SA26" || travelTo.hotelLocationCode2 === "SA26";
    let HotelMadinah = travelTo.hotelLocationCode1 === "SA25" || travelTo.hotelLocationCode2 === "SA25";
    let Transportation = true; //DropdownList.LookupTravelTo.find(x => x.value === travelTo).name;
    let GroundService = true; //DropdownList.LookupTravelTo.find(x => x.value === travelTo).name;

    let isAllSelected = true;

    let isAirArrivalSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.toLocation === travelTo.arrivalAirLocationCode) !== undefined;
    if (!umrahPackageDetails.umrahFlight && FlightArrival && !isAirArrivalSelected) {
      validationMessage.push("Please select Arrival Flight.");
      isAllSelected = false;
    }

    let isAirDepartureSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.fromLocation === travelTo.departureAirLocationCode) !== undefined;
    if (!umrahPackageDetails.umrahFlight && FlightDeparture && !isAirDepartureSelected) {
      validationMessage.push("Please select Departure Flight.");
      isAllSelected = false;
    }

    let isHotelMakkahSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "hotel"
          && (x.offlineItem.fromLocation === travelTo.hotelLocationCode1
            || x.offlineItem.fromLocation === travelTo.hotelLocationCode2
          )) !== undefined;
    if (HotelMakkah && !isHotelMakkahSelected) {
      validationMessage.push("Please select Makka Hotel");
      isAllSelected = false;
    }

    let isTransportationSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "transportation");
    if (Transportation && !isTransportationSelected) {
      validationMessage.push("Please select Transportaion");
      isAllSelected = false;
    }

    let isGroundserviceSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "groundservice");
    if (GroundService && !isGroundserviceSelected) {
      validationMessage.push("Please select Ground Service");
      isAllSelected = false;
    }

    if (umrahPackageDetails.umrahFlight) {
      let isShowFlightDetails = this.state.isShowFlightDetails
      if (!isShowFlightDetails && isAllSelected) {
        isShowFlightDetails = true;
      }
      else if (isShowFlightDetails && isAllSelected) {
        this[`flightdetails`].handleChildSubmit();
      }
      this.setState({ validationMessage: validationMessage, isShowFlightDetails: isShowFlightDetails })
    }
    else {
      if (isAllSelected)
        this.props.history.push(`/Cart`);
      this.setState({ validationMessage: validationMessage })
    }
  };

  sendEmail = () => {
    this.setState({
      isEmail: !this.state.isEmail,
    });
  };

  addItem = (item) => {
    const umrahPackageItems = JSON.parse(localStorage.getItem("umrahPackageItems"));
    let items = umrahPackageItems ? umrahPackageItems : [];
    item.offlineItem && items.push(item);

    localStorage.setItem("umrahPackageItems", JSON.stringify(items));

    (item.itemDtl || item.business === "air") &&
      this.state.type === "umrah-package" &&
      this.handleQuotationImportItem(item);

    this.setState({
      items: JSON.parse(localStorage.getItem("umrahPackageItems")),
      detailsKey: this.state.detailsKey + 1,
      isShowSearch: false,
    });
  };

  handleItemDelete = (item) => {
    const umrahPackageItems = JSON.parse(localStorage.getItem("umrahPackageItems"));
    let items = umrahPackageItems ? umrahPackageItems : [];

    let dataItem = items.filter((x) => (x.offlineItem && x.offlineItem.uuid) === (item.offlineItem && item.offlineItem.uuid));

    let reqOBJ = dataItem[0].removeRequest;
    reqOBJ.Request.Data = reqOBJ.Request.Data[0];
    reqOBJ.Request.Data.SecondaryBusinessObjectItemId = reqOBJ.Request.Data.Value;

    let reqURL = "api/v1/cart/remove";
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {

      }.bind(this)
    );

    items = items.filter(
      (x) =>
        (x.offlineItem && x.offlineItem.uuid) !==
        (item.offlineItem && item.offlineItem.uuid)
    );

    this.setState({ items, detailsKey: this.state.detailsKey + 1 });
    localStorage.setItem("umrahPackageItems", JSON.stringify(items));
  };

  changeQuotationTab = (businessName) => {
    this.setState({ businessName, importItem: false, isShowSearch: true });
  };

  resetQuotation = () => {
    localStorage.removeItem("umrahPackageDetails");
    localStorage.removeItem("umrahPackageItems");
    localStorage.removeItem("cartLocalId");
    this.setState({ items: [], validationMessage: [] });
  };

  handleOffline = (item) => {
    this.addItem({ offlineItem: item });
  };

  saveQuotation = () => {
    // Save Quotation Changes
    this.setState({ isBtnLoading: true });
    const quotationInfo = JSON.parse(localStorage.getItem("umrahPackageDetails"));
    var reqURL = "quotation/update";
    var reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      name: quotationInfo.title,
      owner: quotationInfo.customerName,
      isPublic: true,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms,
        offlineItems: localStorage.getItem("umrahPackageItems"),
        duration: quotationInfo.duration,
        startDate: quotationInfo.startDate,
        endDate: quotationInfo.endDate,
        type: this.state.type,
        createdDate: quotationInfo.createdDate,
        status: "saved",
        agentName: localStorage.getItem("agentName") || "",
      },
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      this.setState({
        savedCartId: localStorage.getItem("cartLocalId"),
        isSaveSucessMsg: true,
        isBtnLoading: false,
      });
      let localQuotationInfo = JSON.parse(
        localStorage.getItem("umrahPackageDetails")
      );
      localQuotationInfo.status = "saved";
      localStorage.setItem(
        "umrahPackageDetails",
        JSON.stringify(localQuotationInfo)
      );

      setTimeout(() => {
        this.setState({ isSaveSucessMsg: false });
      }, 5000);

      this.props.match.params.mode === "DetailsInquiry" &&
        this.saveInquiry(quotationInfo);
    });
  };

  saveInquiry = (quotationInfo) => {
    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: quotationInfo.title,
      from: quotationInfo.customerName,
      fromEmail: quotationInfo.email,
      id: localStorage.getItem("inquiryId"),
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms,
        duration: quotationInfo.duration,
        startDate: quotationInfo.startDate,
        endDate: quotationInfo.endDate,
        type: this.state.type,
        createdDate: quotationInfo.createdDate,
        status: "saved",
        title: quotationInfo.title,
        destination: quotationInfo.destination,
        month: quotationInfo.month,
        typetheme: quotationInfo.typetheme,
        budget: quotationInfo.budget,
        inclusions: quotationInfo.inclusions,
        adults: quotationInfo.adults,
        children: quotationInfo.children,
        infant: quotationInfo.infant,
        requirements: quotationInfo.requirements,
        offlineItems: localStorage.getItem("umrahPackageItems"),
        agentName: localStorage.getItem("agentName") || "",
        cartLocalId: localStorage.getItem("cartLocalId"),
      },
      status: "active",
      startDate: "2021-01-22",
      endDate: "2021-01-26",
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
    });
  };

  handleImportItem = (item) => {
    this.setState({
      importItem: item,
      importItemKey: this.state.importItemKey + 1,
    });
  };

  handleQuotationImportItem = (item) => {
    let cartItem = UmrahPackageGetItem(item);
    cartItem.uuid = this.generateUUID();
    this.addItem({ offlineItem: cartItem, removeRequest: cartItem.removeRequest });
  };

  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  /* getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
    });
  }; */

  viewDetailsMode = () => {
    let cartLocalId = localStorage.getItem("cartLocalId");
    window.open(`/EmailView/${cartLocalId}`, "_blank");
    //this.props.history.push(`/EmailView/${cartLocalId}`);
  };

  bookQuotationManually = () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };

    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.response);
      this.bookQuotationManuallyAdd(data.response);
    });
  };

  bookQuotationManuallyAdd = (manualCartId) => {
    let reqURL = "api/v1/cart/add";

    let reqOBJ = {
      Request: {
        CartID: manualCartId,

        Data: [
          {
            ManualItem: {
              business: "hotel",
              Name: "Hotel Test",
              Amount: 1500,
              CurrencyRefCode: "USD",
              LocationInfo: {
                FromLocation: {
                  ID: "AE2",
                  City: "Dubai, Location",
                  Name: "Dubai, Location",
                  CountryID: "AE",
                  Type: "Location",
                  Priority: 1,
                },
              },
              objectIdentifier: "hotel",
              Rating: 5,
              RatingType: "Start",
              dateInfo: {
                startDate: "2021-09-23",
                endDate: "2021-09-25",
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: 2,
                  type: 0,
                },
              ],
              config: [
                {
                  key: "BRN",
                  value: "TESTBRNPS001_MBH",
                },
                {
                  key: "SellPrice",
                  value: "1500",
                },
              ],
              vendors: [
                {
                  item: {
                    name: "manualbookingprovider",
                  },
                },
              ],
              items: [
                {
                  item: [
                    {
                      name: "Double Deluxe",
                      business: "hotel",
                      objectIdentifier: "room",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      this.props.history.push(`/Cart`);
    });
  };

  getUmrahFlightDeteils = (response) => {
    if (response.isErrors)
      return;
    let umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"));
    umrahPackageDetails.umrahFlightDetails = response.data;
    localStorage.setItem("umrahPackageDetails", JSON.stringify(umrahPackageDetails));
    this.setState({
      isShowFlightDetails: false
    })

    this.props.history.push(`/Cart`);
  }

  componentDidMount = () => {
    const { mode } = this.props.match.params;
    mode === "Create" && this.resetQuotation();
    //this.getAuthToken();
  };

  render() {
    const {
      isResults,
      businessName,
      searchRequest,
      resultKey,
      isEmail,
      items,
      detailsKey,
      isSaveSucessMsg,
      isBtnLoading,
      type,
      importItem,
      importItemKey,
      isShowSearch,
    } = this.state;
    const { mode } = this.props.match.params;
    const quotationInfo = JSON.parse(localStorage.getItem("umrahPackageDetails"));

    return (
      <div className="quotation">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>

              {mode === "Create"
                ? type === "umrah-package"
                  ? (localStorage.getItem("isUmrahPortal") ? "Create Umrah Package" : "Create Itinerary")
                  : Trans("_createQuotation")
                : mode === "Edit"
                  ? type === "umrah-package"
                    ? "Edit Umrah Package"
                    : "Edit Quotation"
                  : type === "umrah-package"
                    ? mode !== "DetailsInquiry"
                      ? "Umrah Details"
                      : "Inquiry Details"
                    : "Quotation Details"}

              {type === "Quotation" && mode !== "DetailsInquiry" && (
                <button
                  className="btn btn-sm btn-primary pull-right"
                  onClick={() => this.props.history.push(`/QuotationList`)}
                >
                  {Trans("_manageQuotation")}
                </button>
              )}

              {type === "umrah-package" && mode !== "DetailsInquiry" && !localStorage.getItem("isUmrahPortal") && (
                <button
                  className="btn btn-sm btn-primary pull-right"
                  onClick={() => this.props.history.push(`/ItineraryList`)}
                >
                  {Trans("_manageItineraries")}
                </button>
              )}

              {mode === "DetailsInquiry" && (
                <button
                  className="btn btn-sm btn-primary pull-right"
                  onClick={() => this.props.history.push(`/InquiryList`)}
                >
                  {Trans("Manage Inquiries")}
                </button>
              )}
            </h1>
          </div>
        </div>
        <div className="container">
          {mode === "Create" && (
            <UmrahPackageCreate
              type={type}
              handleCreate={this.generateQuotation}
              handleDateChange={this.props.setDate}
            />
          )}

          {mode === "Edit" && (
            <UmrahPackageCreate
              type={type}
              {...quotationInfo}
              handleCreate={this.generateQuotation}
              handleDateChange={this.props.setDate}
            />
          )}

          {(mode === "Details" ||
            mode === "Edit" ||
            mode === "DetailsInquiry") && (
              <React.Fragment>
                <UmrahPackageinfo
                  type={type}
                  {...quotationInfo}
                  type={type}
                  handleEdit={this.handleEdit}
                />

                <UmrahPackageSearch
                  businessName={businessName}
                  history={this.props.history}
                  match={this.props.match}
                  handleResults={this.handleResults}
                  handleSearchRequest={this.handleSearchRequest}
                  changeQuotationTab={this.changeQuotationTab}
                  handleOffline={this.handleOffline}
                  type={type}
                  quotationInfo={quotationInfo}
                  isShowSearch={isShowSearch}
                />

                {isResults && (
                  <UmrahPackageResults
                    key={"resultKey" + resultKey}
                    businessName={businessName}
                    addItem={this.addItem}
                    searchRequest={searchRequest}
                    deleteResults={this.deleteResults}
                    type={type}
                  />
                )}

                {type === "umrah-package" && (
                  <React.Fragment>

                    {importItem && (
                      <UmrahPackageItineraryAddOffline
                        type={type}
                        business={businessName}
                        handleOffline={this.handleOffline}
                        importItem={importItem}
                        key={"importItemKey" + importItemKey}
                      />
                    )}

                    <UmrahPackageItineraryDetails
                      {...quotationInfo}
                      items={items}
                      handleItemDelete={this.handleItemDelete}
                      key={"detailsKey" + detailsKey}
                      type={this.state.type}
                    />

                    {isSaveSucessMsg && (
                      <h6 className="alert alert-success mt-3">
                        Umrah Package Saved Successfully!
                      </h6>
                    )}
                    {JSON.stringify(this.state.items.umrahFlightDetails)}
                    {this.state.isShowFlightDetails &&
                      <UmrahPackageFlightDetails
                        onRef={ref => (this[`flightdetails`] = ref)}
                        getUmrahFlightDeteils={this.getUmrahFlightDeteils}
                        data={JSON.parse(localStorage.getItem("umrahPackageDetails")).umrahFlightDetails}
                      />
                    }
                    {this.state.validationMessage.map((item, index) => {
                      return (
                        <h6 class="alert alert-danger mt-3" role="alert">
                          {item}
                        </h6>
                      );
                    })}

                    <div className="quotation-action-buttons mt-4 text-right">

                      <button
                        onClick={this.bookUmrahPackage}
                        className="btn btn-sm btn-primary ml-2 mr-2"
                      >
                        Book Umrah Package
                      </button>


                    </div>

                    {isEmail && (
                      <ItineraryEmail
                        {...quotationInfo}
                        sendEmail={this.sendEmail}
                        items={items}
                        type={type}
                      />
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
        </div>

        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}
      </div>
    );
  }
}

export default Umrahpackage;
