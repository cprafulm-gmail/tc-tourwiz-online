import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import Duration from "../assets/images/clock.svg";
import ActionModal from "../helpers/action-modal";
import moment from "moment";
import Amount from "../helpers/amount";
import Date from "../helpers/date";
import * as Global from "../helpers/global";
import SearchWidget from "../components/search/search-widget";
import Loader from "../components/common/loader";
import { Sticky, StickyContainer } from "react-sticky";
import Stops from "../components/common/stops";
import PaperRatesListFilter from "./paper-rates-list-filter";
import { scroller } from "react-scroll";

class PaperRateResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromLocation: [],
      toLocation: [],
      FromAirportCode: '',
      ToAirportCode: '',
      airlineName: '',
      departclass: '',
      stops: '',
      DepartAirline: '',
      ReturnAirline: '',
      DepartFromDate: '',
      DepartToDate: '',
      ReturnFromDate: '',
      ReturnToDate: '',
      fromLocationIsValid: "valid",
      toLocationIsValid: "valid",
      results: [],
      resultsExport: "",
      notRecordFound: false,
      isDeleteConfirmPopup: false,
      deleteItem: "",
      isImport: false,
      isFilters: false,
      currentPage: 0,
      pageSize: 10,
      totalRecords: 0,
      hasNextPage: false,
      isBtnLoading: true,
      isBtnLoadingExport: false,
      isBtnLoadingContinue: false,
      isshowauthorizepopup: false,
      isBtnLoadingMode: false,
      isSuccessPopup: false,
      invalidTravellerMsg: "",
      passenger: false,
      bookKey: "",
      BookDetailsID: "",
      adult: 1,
      child: 0,
      infant: 0,
      totalTravellers: 0,
      error: false,
      isSuccess: false,
      isRoundTrip: true,
      bookingItemCount: 0,
      TransactionExpireTime: "",
      Token: "",
      isErrorAvailability: false
    };
    this.myRef = null;

  }
  componentDidUpdate() {
    if (this.state.callModifySearch) {
      this.setState({
        callModifySearch: false,
        isLoading: true,
      });
      this.getPaperRates();
    }
  }

  componentDidMount() {
    this.getAuthToken();
    this.props.history.listen((location, action) => {
      this.setState({
        callModifySearch: true,
      });
    });
  }
  getAuthToken = () => {
    if (this.props.match.params.filtermode) {
      this.setDefaultFilter(this.getPaperRates);
    }
    else {
      this.getPaperRates(false, undefined, "page-load");
    }
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);

      if (this.props.match.params.filtermode) {
        this.setDefaultFilter(this.getPaperRates);
      }
      else {
        this.getPaperRates(false, undefined, "page-load");
      }
    }); */
  };
  setDefaultFilter = (callback) => {
    let filter = this.state.filter;
    filter.fromDate = moment().format("YYYY-MM-DD");
    filter.toDate = moment().format("YYYY-MM-DD");
    filter.searchBy = "followupdate";
    filter.dateMode = "today";

    this.setState({ filter }, () => { callback(); });
  }

  getPaperRates = (isExport = false, callback, isBtnLoadingMode) => {
    if (isExport) {
      this.setState({ isBtnLoadingExport: true });
    }
    else
      this.setState({ totalRecords: 0, isBtnLoadingMode, notRecordFound: false });

    let tripDirection = this.props.match.params.roomDetails ? this.props.match.params.roomDetails.split(",")[1].toLowerCase() : "roundtrip";
    let isViewAll = this.props.match.params.roomDetails === undefined;

    var reqURL = "paperrates/list";
    let FromAirportCode = this.props.match.params.locationID ? this.props.match.params.locationID.split("|")[0] : "";
    let ToAirportCode = this.props.match.params.locationID ? this.props.match.params.locationID.split("|")[1] : "";
    let isRoundTrip = tripDirection === "roundtrip" ? true : false;
    let DepartFromDate = this.props.match.params.checkInDate ?? "";// + "T00:00:00";
    let DepartToDate = this.props.match.params.checkInDate ?? "";// + "T00:00:00";
    let ReturnFromDate = tripDirection === "oneway" ? (this.props.match.params.checkInDate ?? "") : (this.props.match.params.checkOutDate ?? "");
    let ReturnToDate = tripDirection === "oneway" ? (this.props.match.params.checkInDate ?? "") : (this.props.match.params.checkOutDate ?? "");

    let cPage = this.state.currentPage;
    let pSize = this.state.pageSize;
    const { airlineName, supplier, departclass, stops, } = this.state;
    var reqURL =
      "paperrates/list";
    var reqOBJ = {
      isRoundTrip: isViewAll ? null : isRoundTrip,
      FromAirportCode: FromAirportCode,
      ToAirportCode: ToAirportCode,
      DepartFromDate: DepartFromDate,
      DepartToDate: DepartToDate,
      ReturnFromDate: ReturnFromDate,
      ReturnToDate: ReturnToDate,
      DepartAirline: airlineName === "undefined" ? "" : airlineName,
      ReturnAirline: airlineName === "undefined" ? "" : airlineName,
      supplier: supplier === "undefined" ? "" : supplier,
      class: departclass === "undefined" ? "" : departclass,
      stops: stops === "undefined" ? "" : stops,
      IsfromSearch: true,
      pageNo: cPage,
      pageSize: pSize,
      isViewAll: isViewAll
    };
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let results = this.state.results || [];
        if (isBtnLoadingMode === 'pageing') {
          results = results.concat(data.response);
        }
        else {
          results = data.response;
        }
        let notRecordFound = results <= 0 ? true : false;
        results.filter((x) => x.status === "deleted");
        let hasNextPage = true;
        if (
          data?.pageInfo?.totalRecords > (this.state.currentPage === 0 ? 1 : this.state.currentPage + 1) * this.state.pageSize
        ) {
          hasNextPage = true;
        } else {
          hasNextPage = false;
        }
        this.setState({
          results,
          totalRecords: data?.pageInfo?.totalRecords ?? 0,
          defaultResults: results,
          hasNextPage,
          notRecordFound,
          isBtnLoading: false,
          isBtnLoadingMode: "",
        });

      },
      "POST"
    );
  };
  deletePaperRates = (item) => {
    this.setState({
      deleteItem: item,
      isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
      currentPage: 0,
    });
  };
  confirmDeletePaperRates = () => {
    let deleteItem = this.state.deleteItem;
    let paperRateID = deleteItem.paperRateID;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "paperrates/delete";
    var reqOBJ = {
      paperrateid: paperRateID
    }
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      this.getPaperRates(false, undefined, "delete");
    });
  };
  handlePaginationResults = (currentPage) => {
    this.setState({ isBtnLoadingMode: true, currentPage }, () =>
      this.getPaperRates(false, undefined, "pageing")
    );
  };

  handleBookDetails = (paperRateID) => {
    this.setState({ passenger: false, BookDetailsID: '', error: '', adult: 1, child: 0, infant: 0 })
    const key = this.props.location.pathname.replace("/paperrates/", "");
    const passenger = true;
    const BookDetailsID = paperRateID;
    const airPaperRateId = this.state.results.filter(x => x.paperRateID === paperRateID)[0].airPaperID;
    this.setState({ passenger, BookDetailsID, key, airPaperRateId }, () => {
      scroller.scrollTo("Travellers", {
        duration: 1000,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -200
      });
    });

  }

  handleSendRequest = (paperRateID) => {
    this.setState({ passenger: false, BookDetailsID: '', error: '', PaperRateID: paperRateID })
    var reqURL =
      "paperrates/sendrequestforprice";
    var reqOBJ = {
      PaperRateID: paperRateID
    };
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({ isSuccessPopup: true })
        setTimeout(() => {
          this.setState({ isSuccessPopup: false });
        }, 5000);
      },
    );
  }
  handleSuccessPopup = () => {
    this.setState({
      isSuccessPopup: !this.state.isSuccessPopup,
    });
  };

  handleTravellersPax = (item) => {
    const paperRateID = item.paperRateID;
    const availableSeats = item.availableSeats;
    const data = this.state;
    const totalTravellers = Number(data.adult) + Number(data.child) + Number(data.infant);
    data.totalTravellers = totalTravellers;
    if (totalTravellers > availableSeats) {
      this.setState({ error: true, data });
    }
    else if (totalTravellers === 0) {
      this.setState({ error: true, data });
    }
    else {
      this.setState({ isSuccess: true, error: false, data });
    }
  }
  handleOnChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  handleAdultCount = (mode, seats) => {
    const data = this.state;
    if (mode === "add") {
      data.adult = Number(data.adult) + 1;
      data.adult = data.adult > Number(seats) ? Number(seats) : data.adult;
      this.setState({ data })
    }
    else {
      data.adult = Number(data.adult) - 1;
      data.adult = data.adult < 1 ? 1 : data.adult;
      this.setState({ data })
    }
  }
  handleChildCount = (mode, seats) => {
    const data = this.state;
    if (mode === "add") {
      data.child = Number(data.child) + 1;
      data.child = data.child > Number(seats) ? Number(seats) : data.child;
      this.setState({ data })
    }
    else {
      data.child = Number(data.child) - 1;
      data.child = data.child < 0 ? 0 : data.child;
      this.setState({ data })
    }
  }
  handleInfantCount = (mode, seats) => {
    const data = this.state;
    if (mode === "add") {
      data.infant = Number(data.infant) + 1;
      data.infant = data.infant > Number(seats) ? Number(seats) : data.infant;
      this.setState({ data })
    }
    else {
      data.infant = Number(data.infant) - 1;
      data.infant = data.infant < 0 ? 0 : data.infant;
      this.setState({ data })
    }
  }

  CheckPaperRatesSeatAvailability = () => {
    let item = this.state.results.filter(x => x.paperRateID === this.state.BookDetailsID)[0];
    this.setState({ totalRecords: 0, isBtnLoadingContinue: true });
    var reqURL =
      "paperrates/checkavailability?airpaperid=" + item.airPaperID +
      "&seats=" + (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant));
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response === "success") {
          //this.bookQuotationManuallyCreate();
          this.BlockPaperRatesSeats(null);
        } else {
          this.setState({
            error: true,
            isErrorAvailability: true,
            isBtnLoadingContinue: false,
          });
        }

      },
      "GET"
    );
  };

  BlockPaperRatesSeats = (cartid) => {
    let item = this.state.results.filter(x => x.paperRateID === this.state.BookDetailsID)[0];

    var reqURL =
      "paperrates/block";
    var reqOBJ = {
      paperrateid: item.paperRateID,
      seats: (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))
    };
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response) {
          this.setState({
            TransactionExpireTime: data.response.transactionExpireTime,
            Token: data.response.token
          });
          this.bookQuotationManuallyAdd(cartid);
        } else {
          this.setState({
            isBtnLoading: false,
          });
        }

      },
      "POST"
    );
  };

  handleContinuebtn = (paperRateID) => {
    const { adult, child, infant } = this.state;
    const totalTravellers = Number(adult) + Number(child) + Number(infant);
    let item = this.state.results.filter(x => x.paperRateID === paperRateID)[0];
    const availableSeats = item.availableSeats;
    if (totalTravellers > availableSeats) {
      this.setState({ error: true });
    }
    else if (totalTravellers > 0) {
      this.setState({ error: false });
      this.CheckPaperRatesSeatAvailability(paperRateID)
    }
    else {
      this.setState({ invalidTravellerMsg: "Please select at least one traveller", error: false });
      setTimeout(() => {
        this.setState({ invalidTravellerMsg: "" });
      }, 5000);

    }
  }

  bookQuotationManuallyCreate = () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };

    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.response);
      this.BlockPaperRatesSeats(data.response);

    });
  };

  bookQuotationManuallyAdd = (manualCartId) => {
    let bookingTtems = [];
    bookingTtems.push(this.state.results.filter(x => x.paperRateID === this.state.BookDetailsID)[0]);
    if (this.state.bookingItemCount < bookingTtems.length) {
      this.bookQuotationItemsManually(manualCartId, bookingTtems);
    } else {
      this.props.history.push(`/Cart`);
    }
  };

  bookQuotationItemsManually = (manualCartId, bookingTtems) => {
    let item = bookingTtems[this.state.bookingItemCount];
    if (Global.getEnvironmetKeyValue("isCart") === false) localStorage.removeItem("cartLocalId");
    let reqURL = "api/v1/cart/create";

    let reqOBJ = {
      Request: {
        CartID: null,
        Data: this.getRequestInfo(item, "air"),
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (localStorage.getItem("cartLocalId") === null) {
        localStorage.setItem("cartLocalId", data.response);
      }
      this.setState(
        {
          bookingItemCount: this.state.bookingItemCount + 1,
        },
        () => this.bookQuotationManuallyAdd(manualCartId)
      );
    });
  };

  getRequestInfo = (item, business) => {
    if (business === "air") {
      if (!item.isRoundTrip) {
        return [
          {
            ManualItem: {
              business: "air",
              objectIdentifier: "flightOption",
              TripType: "oneway",
              Amount: item.sellPrice !== "" ? (item.sellPrice * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))) : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration !== ""
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit: item.departToDate,
              Description: "",
              LocationInfo: {
                FromLocation: {
                  ID: item.fromAirportCode || "Unnamed",
                  Name: item.fromAirportName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocation || "Unnamed",
                  City: item.fromLocation || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toAirportCode || "Unnamed",
                  Name: item.toAirportName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocation || "Unnamed",
                  City: item.toLocation || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate: item.departFromDate,
                endDate: item.departToDate,
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: this.state.adult !== "" ? parseInt(this.state.adult) : 1,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: this.state.child !== "" ? parseInt(this.state.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: this.state.infant !== "" ? parseInt(this.state.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.supplier,
                  },
                },
              ],
              StopDetails: [item.departStops !== "" ? item.departStops : 0],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate: item.departFromDate,
                    endDate: item.departToDate
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromAirportCode || "Unnamed",
                      Name: item.fromAirportName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocation || "Unnamed",
                      City: item.fromLocation || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toAirportCode || "Unnamed",
                      Name: item.toAirportName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocation || "Unnamed",
                      City: item.toLocation || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "durationHours",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: (item.departDuration !== ""
                        ? parseInt(
                          item.departDuration.split(" ")[0].replace("h", "")
                        )
                        : 0) * 60 +
                        (item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : 0),
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirline,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirline,
                          },
                        },
                      ],
                      images: item.departImg
                        ? [
                          {
                            URL: item.departImg,
                            Type: "default",
                            IsDefault: true,
                          },
                        ]
                        : [],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration.split(" ")[0].replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration.split(" ")[1].replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      } else {
        return [
          {
            ManualItem: {
              business: "air",
              objectIdentifier: "flightOption",
              TripType: "roundtrip",
              Amount: item.sellPrice !== "" ? (item.sellPrice * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))) : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration !== ""
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit: item.departToDate,
              Description: "",
              LocationInfo: {
                FromLocation: {
                  ID: item.fromAirportCode || "Unnamed",
                  Name: item.fromAirportName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocation || "Unnamed",
                  City: item.fromLocation || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toAirportCode || "Unnamed",
                  Name: item.toAirportName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocation || "Unnamed",
                  City: item.toLocation || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate: item.departFromDate,
                endDate: item.departToDate,
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: this.state.adult !== "" ? parseInt(this.state.adult) : 1,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: this.state.child !== "" ? parseInt(this.state.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: this.state.infant !== "" ? parseInt(this.state.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.supplier,
                  },
                },
              ],
              StopDetails: [
                item.departStops !== "" ? item.departStops : 0,
                item.returnStops !== "" ? item.returnStops : 0,
              ],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate: item.departFromDate,
                    endDate: item.departToDate
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromAirportCode || "Unnamed",
                      Name: item.fromAirportName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocation || "Unnamed",
                      City: item.fromLocation || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toAirportCode || "Unnamed",
                      Name: item.toAirportName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocation || "Unnamed",
                      City: item.toLocation || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.departClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: (item.departDuration !== ""
                        ? parseInt(
                          item.departDuration.split(" ")[0].replace("h", "")
                        )
                        : 0) * 60 +
                        (item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : 0),
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirline,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirline,
                          },
                        },
                      ],
                      images: [
                        {
                          URL: item.departImg,
                          Type: "default",
                          IsDefault: true,
                        },
                      ],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration.split(" ")[0].replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration.split(" ")[1].replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
                {
                  totalDuration:
                    item.returnDuration !== ""
                      ? parseInt(
                        item.returnDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate: item.returnFromDate,
                    endDate: item.returnToDate
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.toAirportCode || "Unnamed",
                      Name: item.toAirportName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocation || "Unnamed",
                      City: item.toLocation || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.fromAirportCode || "Unnamed",
                      Name: item.fromAirportName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocation || "Unnamed",
                      City: item.fromLocation || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.returnClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.returnDuration !== ""
                          ? parseInt(
                            item.returnDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.returnDuration !== ""
                          ? parseInt(
                            item.returnDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: (item.returnDuration !== ""
                        ? parseInt(
                          item.returnDuration.split(" ")[0].replace("h", "")
                        )
                        : 0) * 60 +
                        (item.returnDuration !== ""
                          ? parseInt(
                            item.returnDuration.split(" ")[1].replace("m", "")
                          )
                          : 0),
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.returnAirline,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.returnAirline,
                          },
                        },
                      ],
                      images: item.returnImg
                        ? [
                          {
                            URL: item.returnImg,
                            Type: "default",
                            IsDefault: true,
                          },
                        ]
                        : [],
                      Code: item.returnFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.returnClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.returnDuration !== ""
                              ? parseInt(
                                item.returnDuration.split(" ")[0].replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.returnDuration !== ""
                              ? parseInt(
                                item.returnDuration.split(" ")[1].replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      }
    }
  };

  getCostPrice = (item) => {
    return item.costPrice && item.costPrice !== ""
      ? (item.costPrice * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))).toString().replace(/,/g, "")
      : ((item.sellPrice) * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))).toString().replace(/,/g, "")
  }
  getAmountValue = (amount, amountToRepace) => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      amount = amount.toString().replace(/,/g, "");
    }
    else if (amount && !isNaN(Number(amount)) && Number(amount) === 0) {
      amount = amountToRepace ? amountToRepace : 0
    }
    else
      amount = amountToRepace ? amountToRepace.toString().replace(/,/g, "") : 0
    return amount;
  }

  getbrnconfig = (item) => {
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = "air";
    if (business === "transfers" || business === "custom") business = "activity";

    let objconfig = [];
    objconfig = [
      {
        key: "SellPrice",
        value: Number(item.totalAmount) > 0 ? Number(item.totalAmount) * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant)) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice * (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant)) : "1"),
      },
      {
        key: "CostPrice",
        value:
          this.getCostPrice(item)
      },
      {
        key: "isPaperRateItem",
        value: true,
      },
      {
        key: "pickupTime",
        value: item.pickupTime,
      },
      {
        key: "supplierCurrency",
        value:
          item.supplierCurrency && item.supplierCurrency !== ""
            ? item.supplierCurrency.split(" ")[0]
            : Global.getEnvironmetKeyValue("portalCurrencySymbol"),
      },
      {
        key: "conversionRate",
        value:
          item.conversionRate && item.conversionRate !== ""
            ? item.conversionRate
            : "1",
      },
      {
        key: "supplierCostPrice",
        value: this.getAmountValue(item.supplierCostPrice, this.getCostPrice(item))
      },
      {
        key: "supplierTaxPrice",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice
            : "0",
      },
      {
        key: "supplierCostPricePortalCurrency",
        value:
          item.supplierCostPrice && item.supplierCostPrice !== ""
            ? parseFloat(item.supplierCostPrice.toString().replace(/,/g, "")) *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : "1"
            )
            : "0",
      },
      {
        key: "supplierTaxPricePortalCurrency",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : "1"
            )
            : "0",
      },
      {
        key: "markupPrice",
        value:
          item.markupPrice && item.markupPrice !== "" ? item.markupPrice : "0",
      },
      {
        key: "discountPrice",
        value:
          item.discountPrice && item.discountPrice !== ""
            ? item.discountPrice
            : "0",
      },
      {
        key: "CGSTPrice",
        value: item.CGSTPrice && item.CGSTPrice !== "" ? item.CGSTPrice : "0",
      },
      {
        key: "SGSTPrice",
        value: item.SGSTPrice && item.SGSTPrice !== "" ? item.SGSTPrice : "0",
      },
      {
        key: "IGSTPrice",
        value: item.IGSTPrice && item.IGSTPrice !== "" ? item.IGSTPrice : "0",
      },
      {
        key: "GSTPercentage",
        value: Number(Number(item.percentage) !== 0 ? item.percentage : 18),
      },
      {
        key: "processingFees",
        value: 0,
      },
      {
        key: "tax1Price",
        value: item.tax1 && item.tax1 !== "" ? item.tax1 : "0",
      },
      {
        key: "tax2Price",
        value: item.tax2 && item.tax2 !== "" ? item.tax2 : "0",
      },
      {
        key: "tax3Price",
        value: item.tax3 && item.tax3 !== "" ? item.tax3 : "0",
      },
      {
        key: "tax4Price",
        value: item.tax4 && item.tax4 !== "" ? item.tax4 : "0",
      },
      {
        key: "tax5Price",
        value: item.tax5 && item.tax5 !== "" ? item.tax5 : "0",
      },
      {
        key: "tax1Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 160)?.name ?? ""
          : ""
      },
      {
        key: "tax2Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 161)?.name ?? ""
          : ""
      },
      {
        key: "tax3Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 162)?.name ?? ""
          : ""
      },
      {
        key: "tax4Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 163)?.name ?? ""
          : ""
      },
      {
        key: "tax5Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 164)?.name ?? ""
          : ""
      },
      {
        key: "gstTaxType",
        value: item.taxType && item.taxType !== "" ? item.taxType : "",
      },
      {
        key: "totalAmount",
        value: Number(item.totalAmount ?? 0),
      },
      {
        key: "isInclusiveGST",
        value: (item.isInclusive === "" || !item.isInclusive) ? false : item.isInclusive,
      },
      {
        key: "amountWithoutGST",
        value: (item.amountWithoutGST === "" || !item.amountWithoutGST) ? "0" : item.amountWithoutGST,
      },
      {
        key: "gstTaxAppliedOn",
        value: (Number(item.processingFees) > 0 ? "processing-fees" : "sell-price"),
      },
      {
        key: "TransactionExpireTime",
        value: this.state.TransactionExpireTime
      },
      {
        key: "PaperRateSeatTransactionToken",
        value: this.state.Token
      },
      {
        key: "AirPaperRateId",
        value: this.state.airPaperRateId
      },
      {
        key: "TotalSeats",
        value: (parseInt(this.state.adult) + parseInt(this.state.child) + parseInt(this.state.infant))
      },
      {
        key: "PaperRateId",
        value: this.state.BookDetailsID
      },
      {
        key: "IsInternational",
        value: item.fromLocationCountry !== item.toLocationCountry
      }
    ];

    return objconfig;
  };

  handlePaperRatesUserFilter = (state) => {
    const data = this.state;
    data.airlineName = state.data.departAirlineName;
    data.supplier = state.data.supplier;
    data.departclass = state.data.departClass;
    data.stops = state.data.departStops;
    this.setState({ data });
    this.getPaperRates(false, undefined, "page-load");
  }
  showHideFilters = () => {
    this.setState({ isHideShowFilter: !this.state.isHideShowFilter })
  }
  closeFilters = () => {
    this.setState({ isHideShowFilter: false })
  }
  render() {
    const { results, isDeleteConfirmPopup, isFilters, currentPage, hasNextPage, isBtnLoading, BookDetailsID, totalRecords, isBtnLoadingContinue, invalidTravellerMsg, isHideShowFilter, isBtnLoadingMode } = this.state;
    const { notAvailable } = "Not Available"
    const { userInfo } = this.props;
    const businessName = "air";
    return (
      <div className="quotation quotation-list">
        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <div
                className={
                  "hight-z-index mod-search-area"}
                style={{ ...style, transform: "inherit" }}
              >
                <SearchWidget
                  history={this.props.history}
                  match={this.props.match}
                  getResults={this.getPaperRates}
                  location={this.props.location}
                  mode={"modify"}
                />

              </div>
            )}
          </Sticky>
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mt-2">
                {isHideShowFilter &&
                  <PaperRatesListFilter
                    handlePaperRatesUserFilter={this.handlePaperRatesUserFilter}
                    closeFilters={this.closeFilters}
                    filterType="userList"
                  />
                }
              </div>
            </div>
          </div>
          {!isBtnLoading && totalRecords > 0 &&
            <React.Fragment>
              <div className="container">
                <div className="mt-2">
                  <div class="row no-gutters align-items-center m-1">
                    <div class="col-lg-5 col-sm-12 pt-4">
                      <h5>
                        <span>{totalRecords}</span>
                        <b> Flight Paper Rate(s)</b> Found Matching Your Search
                      </h5>
                    </div>
                    <div className="col-lg-7 sm-12 pt-4">
                      <button
                        className="btn btn-sm btn-secondary pull-right mr-2"
                        onClick={this.showHideFilters}
                      >
                        Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
          {isBtnLoading &&
            <Loader />
          }
          <div className="container">
            <div className="mt-2">
              {results && !isBtnLoading && results.length > 0 && (
                <React.Fragment>
                  <div className={results.length === 1 ? "mb-5" : ""}>
                    {results.map((item, key) => {
                      return (
                        <React.Fragment>
                          <div
                            key={key}
                            className="card pl-3 pr-3 pt-3 mb-2  position-relative"
                          >
                            <div className=" card-body row quotation-list-item  d-flex justify-content-center">
                              <div className="col-lg-8 pb-3">
                                <div className="row">
                                  <div className="col-lg-12">
                                    {item.isRoundTrip &&
                                      <button

                                        className="btn btn-sm btn-muted text-primary"
                                      >
                                        Round trip
                                      </button>
                                    }
                                    {!item.isRoundTrip &&
                                      <button
                                        className="btn btn-sm btn-muted text-primary"
                                      >
                                        One Way
                                      </button>
                                    }
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-lg-3 text-center p-5">
                                    <h6 className="text-secondary text-capitalize font-weight-bold">{item.departAirline}</h6>
                                    {/* <small className="font-weight-bold text-secondary text-capitalize">#{item.departFlightNumber ? item.departFlightNumber : "N/A"}</small> */}
                                  </div>
                                  <div className="col-lg-3">
                                    <h5 className="text-primary d-flex justify-content-start">{item.fromLocation} ({item.fromAirportCode})</h5>
                                    <h6 className="text-secondary d-flex justify-content-start">{item.fromAirportName}</h6>
                                    <small className="d-flex justify-content-start"><Date
                                      date={item.departFromDate}
                                      format="shortDate"
                                    />

                                      {" "} <Date date={item.departFromDate} format="shortTime" /></small>
                                    <small className="text-capitalize d-flex justify-content-start pt-1">Flight Number: {item.departFlightNumber ? item.departFlightNumber : "N/A"}</small>

                                  </div>
                                  <div className="col-lg-3 text-center">
                                    <small >
                                      <img
                                        className="pb-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Duration}
                                        alt=""
                                      />
                                      {item.departDuration !== "h m" ? " " + item.departDuration : "  0h 0m"}
                                    </small>
                                    <Stops {...[item.departStops]} />
                                    <small>{item.departStops ? item.departStops + "  stops" : "nonstop"} | {item.departClass ? item.departClass : "N/A"}</small>
                                  </div>
                                  <div className="col-lg-3">
                                    <h5 className="text-primary d-flex justify-content-end ">{item.toLocation} ({item.toAirportCode})</h5>
                                    <h6 className="text-secondary  d-flex justify-content-end">{item.toAirportName}</h6>
                                    <small className=" d-flex justify-content-end"><Date
                                      date={item.departToDate}
                                      format="shortDate"
                                    />

                                      {" "} <Date date={item.departToDate} format="shortTime" />
                                    </small>
                                  </div>
                                </div>
                                {item.isRoundTrip &&
                                  <React.Fragment>
                                    <div className="row mt-5">
                                      <div className="col-lg-3 text-center p-5">
                                        <h6 className="text-secondary text-capitalize font-weight-bold ">
                                          {item.returnAirline}</h6>
                                        {/* <small className="font-weight-bold text-secondary text-capitalize">#{item.returnFlightNumber}</small> */}
                                      </div>
                                      <div className="col-lg-3">
                                        <h5 className="text-primary d-flex justify-content-start ">{item.toLocation} ({item.toAirportCode})</h5>
                                        <h6 className="text-secondary d-flex justify-content-start">{item.toAirportName}</h6>
                                        <small className="d-flex justify-content-start"><Date
                                          date={item.returnFromDate}
                                          format="shortDate"
                                        />

                                          {" "} <Date date={item.returnFromDate} format="shortTime" />
                                        </small>
                                        <small className="text-capitalize d-flex justify-content-start pt-1">Flight Number: {item.returnFlightNumber}</small>

                                      </div>
                                      <div className="col-lg-3 text-center">
                                        <small >
                                          <img
                                            className="pb-1"
                                            style={{ filter: "none", height: "16px" }}
                                            src={Duration}
                                            alt=""
                                          />
                                          {item.returnDuration !== "h m" ? " " + item.returnDuration : "  0h 0m"}

                                        </small>
                                        <Stops {...[item.returnStops]} />
                                        <small>{item.returnStops ? item.returnStops + "  stops" : "nonstop"} | {item.returnClass ? item.returnClass : "N/A"}</small>
                                      </div>
                                      <div className="col-lg-3">
                                        <h5 className="text-primary d-flex justify-content-end ">{item.fromLocation} ({item.fromAirportCode})</h5>
                                        <h6 className="text-secondary d-flex justify-content-end">{item.fromAirportName}</h6>
                                        <small className="d-flex justify-content-end">
                                          <Date
                                            date={item.returnToDate}
                                            format="shortDate"
                                          />

                                          {" "} <Date date={item.returnToDate} format="shortTime" /></small>
                                      </div>
                                    </div>

                                  </React.Fragment>
                                }
                              </div>
                              <div className="col-lg-2 d-flex align-items-center pb-3 justify-content-center">
                                <ul class="list-group list-group-flush">
                                  <li class="list-group-item d-flex justify-content-between align-items-center pr-3">
                                    Hold :
                                    <span class="ml-1 badge  badge-pill">{item.onHold}</span>
                                  </li>
                                  <li class="list-group-item d-flex justify-content-between align-items-center pr-3">
                                    Booked :
                                    <span class="ml-1 badge  badge-pill">{item.blocked}</span>
                                  </li>
                                  <li class="list-group-item d-flex justify-content-between align-items-center pr-3">
                                    Available :
                                    <span class="ml-1 badge  badge-pill">{item.availableSeats}</span>
                                  </li>

                                </ul>
                              </div>
                              <div className="col-lg-2 d-flex align-items-center pb-3 justify-content-center">
                                <React.Fragment>
                                  {!item.onRequestPrice &&
                                    <>
                                      <div className="row ">
                                        <div className="col-lg-12 d-flex justify-content-center font-weight-bold mb-4">
                                          <Amount amount={item.sellPrice} />
                                        </div>
                                        <div className="col-lg-12 d-flex justify-content-center">
                                          <button
                                            className="btn btn-sm btn-primary  align-items-center"
                                            onClick={() => this.handleBookDetails(item.paperRateID)}
                                          >
                                            <div className="pl-3 pr-3">Book</div>
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  }
                                  {item.onRequestPrice &&
                                    <div className="custom-dropdown-btn position-relative">
                                      {!this.state.isSuccessPopup ? <button
                                        className="btn btn-sm btn-primary  align-items-center d-flex justify-content-center"
                                        onClick={() => this.handleSendRequest(item.paperRateID)}
                                      >
                                        <div className="pl-3 pr-3">Send Inquiry</div>
                                      </button>
                                        : this.state.PaperRateID === item.paperRateID ? <button className="btn btn-sm btn-primary  align-items-center d-flex justify-content-center">
                                          <span className="spinner-border spinner-border-sm mr-2"></span>
                                          <div className="pr-3">
                                            Send Inquiry
                                          </div>
                                        </button> : <button
                                          className="btn btn-sm btn-primary  align-items-center d-flex justify-content-center"
                                        >
                                          <div className="pl-3 pr-3">Send Inquiry</div>
                                        </button>
                                      }
                                    </div>
                                  }
                                </React.Fragment>
                              </div>
                            </div>
                            {this.state.passenger && BookDetailsID === item.paperRateID &&
                              <div className='row' name="Travellers" style={{ borderRight: "2px solid #ea7c10", borderLeft: "2px solid #ea7c10" }}>
                                <div className="col-lg-12 m-3 " >
                                  <div className="row">
                                    <div className="col-lg-12 mb-3">
                                      <span className="d-block text-primary mb-2 h6 pl-5">Travellers</span>
                                    </div>

                                    <div className="col-lg-3">
                                      <label className="pl-5">Adult(s)</label>
                                      <div className="input-group mb-3">
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleAdultCount("remove", item.availableSeats)}
                                        >
                                          <h5>-</h5>
                                        </button>
                                        <input
                                          type="text"
                                          className="form-control col-lg-8"
                                          name="adult"
                                          value={this.state.adult}
                                          onChange={this.handleOnChange}
                                          placeholder="0"
                                        />
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleAdultCount("add", item.availableSeats)}
                                        >
                                          <h5>+</h5>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="col-lg-3">
                                      <label className="pl-5">Child(s)</label>
                                      <div className="input-group mb-3">
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleChildCount("remove", item.availableSeats)}

                                        >
                                          <h5>-</h5>
                                        </button>
                                        <input
                                          type="text"
                                          name="child"
                                          value={this.state.child}
                                          onChange={this.handleOnChange}
                                          className="form-control col-lg-8"
                                          placeholder="0"
                                        />
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleChildCount("add", item.availableSeats)}
                                        >
                                          <h5>+</h5>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="col-lg-3">
                                      <label className="pl-5">Infant(s)</label>
                                      <div className="input-group mb-3">
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleInfantCount("remove", item.availableSeats)}
                                        >
                                          <h5>-</h5>
                                        </button>
                                        <input
                                          type="text"
                                          name="infant"
                                          value={this.state.infant}
                                          onChange={this.handleOnChange}
                                          className="form-control col-lg-8"
                                          placeholder="0"
                                        />
                                        <button
                                          className="col-lg-2 btn btn-sm btn-muted border-0 text-primary font-weight-bold h1"
                                          onClick={() => this.handleInfantCount("add", item.availableSeats)}
                                        >
                                          <h5>+</h5>
                                        </button>
                                      </div>
                                    </div>

                                    <div className="col-lg-3 d-flex justify-content-center">
                                      <div className="col-lg-12">
                                        <div className="pt-4">
                                          <button
                                            className="btn btn-sm btn-primary form-control mt-1 "
                                            onClick={!isBtnLoadingContinue ? () => { this.handleContinuebtn(item.paperRateID) } : ""}
                                          >
                                            <div className="pl-3 pr-3">
                                              {isBtnLoadingContinue && (
                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                              )}Continue
                                            </div>
                                          </button>
                                          {this.state.error === true &&
                                            <h6 className="alert alert-danger mt-3 d-inline-block">Only {item.availableSeats} Seat(s) are available.</h6>
                                          }
                                          {invalidTravellerMsg !== "" &&
                                            <h6 className="alert alert-danger mt-3 d-inline-block">
                                              {invalidTravellerMsg}
                                            </h6>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {this.state.isSuccessPopup && (
                      <ActionModal
                        title="Success"
                        message="Send Request Successfully!"
                        positiveButtonText="OK"
                        onPositiveButton={this.handleSuccessPopup}
                        handleHide={this.handleSuccessPopup}
                      />
                    )}
                  </div>
                </React.Fragment>
              )}
              {this.state.notRecordFound &&
                <div>
                  <div className="pl-3 pr-3 pt-3 position-relative">
                    <div className="row quotation-list-item d-flex justify-content-center">
                      <div className="col-lg-12 pb-3">
                        <h6 className="ml-3">No Flight Paper Rate(s) found</h6>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
            {
              !this.state.notRecordFound &&
              <nav className={results.length === 1 ? "mb-5 pb-5" : ""}>
                <ul className="pagination justify-content-center mt-3">
                  <li
                    className="page-item"
                    style={{
                      display: "flex",
                      "justifyContent": "space-between",
                      "flexGrow": "2",
                    }}
                  >
                    {!isBtnLoading &&
                      <span className="text-primary">Showing{" "}{(this.state.currentPage + 1) * this.state.pageSize > this.state.totalRecords ? this.state.totalRecords : (this.state.currentPage + 1) * this.state.pageSize}{" "} out of {this.state.totalRecords}</span>}
                    <button
                      className={"page-link" + (!hasNextPage ? " d-none" : "")}
                      onClick={() => this.handlePaginationResults(currentPage + 1)}
                    >
                      {isBtnLoadingMode && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      Show More
                    </button>
                  </li>
                </ul>
              </nav>
            }
          </div >
        </StickyContainer >
      </div >

    )
  }
}
export default PaperRateResults;