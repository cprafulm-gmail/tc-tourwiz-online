import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import mapping from "../components/common/iconMapping";
import HtmlParser from "../helpers/html-parser";
import ImageNotFoundHotel from "../assets/images/ImageNotFound-Hotel.gif";
import MapPopupContainer from "../components/common/map-popup-container";
import * as Global from "../helpers/global";
import Loader from "../components/common/loader";
import VehicleRentalConditionContent from "../components/common/vehicle-rental-condition-content";

import {
  animateScroll as scroll,
  scroller,
} from "react-scroll";

class ResultBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getResultsForMap = (searchToken) => {
    let reqOBJForMap = {
      Request: {
        Token: searchToken,
      },
      Flags: {},
    };

    this.setState({
      resultsForMap: [],
    });
    let reqURL = "api/v1/" + this.state.businessName + "/search/map";

    apiRequester(
      reqURL,
      reqOBJForMap,
      function (data) {
        this.setState({
          resultsForMap: data.status.code === 0 ? data.response : [],
        });
      }.bind(this)
    );
  };

  getResults = (reqOBJ) => {
    localStorage.removeItem("SearchRequest_" + this.state.token);
    this.setState({
      results: [],
      isLoading: true,
      token: "",
      request: reqOBJ,
      wishList: [],
    });

    let reqURL =
      "api/v1/" +
      this.state.businessName +
      ((this.state.businessName === "transportation" || this.state.businessName === "groundservice") ? "/searchwithdetails" : "/search");

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.hideQuickBook();
        this.setState({
          results:
            (data.status.code === 0 &&
              data.firstPage.status.code === 1 &&
              data.firstPage.response === undefined &&
              data.firstPage.response !== undefined &&
              !data.firstPage.response.data.find((x) => x.code === "default")) ||
              data.status.code === 1 ||
              data.status.code === 260015 ||
              data.status.code === 260016 ||
              (data.status.code === 0 && data.firstPage.status.code === 1)
              ? []
              : data.firstPage.response,
          token:
            (data.status.code === 0 &&
              data.firstPage.status.code === 1 &&
              data.firstPage.response === undefined &&
              data.firstPage.response !== undefined &&
              !data.firstPage.response.data.find((x) => x.code === "default")) ||
              data.status.code === 1 ||
              data.status.code === 260015 ||
              (data.status.code === 260016) |
              (data.status.code === 0 && data.firstPage.status.code === 1)
              ? ""
              : data.firstPage.response.token,
          isLoading: false,
        });
        this.getResultsForMap(this.state.token);
      }.bind(this)
    );
  };

  getRequestObject = () => {
    let reqOBJ;
    switch (this.state.businessName) {
      case "hotel":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID,
                    Name: this.props.match.params.locationName,
                    CountryID: this.props.match.params.countryID.split("_")[2],
                    Type: this.props.match.params.countryID.split("_")[1],
                    commonCode: this.props.match.params.countryID.split("_")[0],
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T00:00:00",
                  EndDate: this.props.match.params.checkOutDate + "T23:59:59",
                },
              },
            ],
            PaxInfo: this.getroomDetailsFromQueryString(this.props.match.params.roomDetails),
            Filters: this.getFilterRequestObject(),
          },
        };
        break;

      case "activity":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID,
                    Name: this.props.match.params.locationName,
                    CountryID: this.props.match.params.countryID,
                    Type: this.props.match.params.countryID,
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T17:59:44",
                  EndDate: this.props.match.params.checkOutDate + "T17:59:44",
                },
              },
            ],
            PaxInfo: [
              {
                Item: this.props.match.params.roomDetails.split(",").map((item) => {
                  return {
                    TypeString: "ADT",
                    Quantity: 1,
                    Age: item,
                  };
                }),
              },
            ],
            Filters: this.getFilterRequestObject(),
            Status: "Available",
            Code: "Activity",
            Business: "activity",
          },
        };
        break;

      case "package":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID,
                    Name: this.props.match.params.locationName,
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T17:59:44",
                  EndDate: this.props.match.params.checkOutDate + "T17:59:44",
                },
              },
            ],
            PaxInfo: [
              {
                Item: this.props.match.params.roomDetails.split(",").map((item) => {
                  return {
                    TypeString: "ADT",
                    Quantity: 1,
                    Age: item,
                  };
                }),
              },
            ],
            Filters: this.getFilterRequestObject(),
            Status: "Available",
            Code: "Package",
            Business: "package",
          },
        };
        break;
      case "air":
        let quantity_ADT = this.props.match.params.roomDetails.split(",")[2];
        let quantity_CHD = this.props.match.params.roomDetails.split(",")[3];
        let quantity_INF = this.props.match.params.roomDetails.split(",")[4];
        let tripDirection = this.props.match.params.roomDetails.split(",")[1].toLowerCase();
        let criteriaInfo = [];
        if (tripDirection === "multicity") {
          criteriaInfo = [...Array(this.props.match.params.checkInDate.split('|').length).keys()].map((element, index) => {
            return {
              LocationInfo: {
                FromLocation: {
                  ID: this.props.match.params.locationID.split("|")[index * 2],
                  Name: this.props.match.params.locationName.split("|")[index * 2],
                  CountryID: this.props.match.params.countryID.split("|")[index * 2],
                  Type: "Location",
                },
                toLocation: {
                  ID: this.props.match.params.locationID.split("|")[(index * 2) + 1],
                  Name: this.props.match.params.locationName.split("|")[(index * 2) + 1],
                  CountryID: this.props.match.params.countryID.split("|")[(index * 2) + 1],
                  Type: "Location",
                },
              },
              DateInfo: {
                StartDate: this.props.match.params.checkInDate.split("|")[index] + "T00:00:00",
                EndDate: this.props.match.params.checkInDate.split("|")[index] + "T00:00:00",
              },
              SequenceNumber: index + 1,
            }
          });

        }
        else {
          criteriaInfo = [
            {
              LocationInfo: {
                FromLocation: {
                  ID: this.props.match.params.locationID.split("|")[0],
                  Name: this.props.match.params.locationName.split("|")[0],
                  CountryID: this.props.match.params.countryID.split("|")[0],
                  Type: "Location",
                },
                toLocation: {
                  ID: this.props.match.params.locationID.split("|")[1],
                  Name: this.props.match.params.locationName.split("|")[1],
                  CountryID: this.props.match.params.countryID.split("|")[1],
                  Type: "Location",
                },
                SequenceNumber: 1,
              },
              DateInfo: {
                StartDate: this.props.match.params.checkInDate + "T00:00:00",
                EndDate:
                  tripDirection === "oneway"
                    ? this.props.match.params.checkInDate + "T00:00:00"
                    : this.props.match.params.checkOutDate + "T00:00:00",
              },
              SequenceNumber: 1,
            },
          ]
        }

        reqOBJ = {
          Request: {
            CriteriaInfo: criteriaInfo,
            PaxInfo: [
              {
                Item: [
                  {
                    TypeString: "ADT",
                    Quantity: quantity_ADT,
                  },
                  {
                    TypeString: "CHD",
                    Quantity: quantity_CHD,
                  },
                  {
                    TypeString: "INF",
                    Quantity: quantity_INF,
                  },
                ],
              },
            ],
            VendorCriteria:
              this.getFilterValue("airlinecode") && this.getFilterValue("airlinename")
                ? {
                  inclusions: [
                    {
                      id: this.getFilterValue("airlinecode"),
                      name: this.getFilterValue("airlinename"),
                    },
                  ],
                  exclusions: [
                    {
                      id: null,
                      name: null,
                    },
                  ],
                }
                : null,
            Filters: this.getFilterRequestObject(),
            TripType: tripDirection,
            flags: this.getFilterValue("isIndividualRoute")
              ? { isIndividualRoute: this.getFilterValue("isIndividualRoute") }
              : {},
          },
          Flags: {
            //"feature:disableseparateroundtrip": true,
          },
        };
        break;
      case "groundservice":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T00:00:00",
                  EndDate: this.props.match.params.checkInDate + "T00:00:00",
                },
              },
            ],
            PaxInfo: [
              {
                Item: [
                  {
                    Quantity: this.props.match.params.checkOutDate,
                  },
                ],
              },
            ],
            Filters: this.getFilterRequestObject(),
            Status: "Available",
            Code: "groundservice",
            Business: "activity",
          },
        };
        break;
      case "transportation":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID,
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T00:00:00",
                },
              },
            ],
            PaxInfo: [
              {
                Item: [
                  {
                    Quantity: this.props.match.params.checkOutDate,
                  },
                ],
              },
            ],
            Filters: this.getFilterRequestObject(),
            Status: "Available",
            Code: "transportation",
            Business: "activity",
          },
        };
        break;
      case "transfers":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID.split("|")[0],
                    Name: this.props.match.params.locationName.split("|")[0],
                    CountryID: this.props.match.params.countryID.split("|")[0],
                    Type: this.getFilterValue("PickupType"),
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T00:00:00",
                  EndDate:
                    this.getFilterValue("TripType") === "oneway"
                      ? this.props.match.params.checkInDate + "T00:00:00"
                      : this.props.match.params.checkOutDate + "T00:00:00",
                  StartTime: this.getFilterValue("TransfersStartHour"), //this.getFilterValue("TransfersStartHour") + ":" + this.getFilterValue("TransfersStartMinute"),
                  EndTime: this.getFilterValue("TransfersStartMinute"), //+ ":" + this.getFilterValue("TransfersStartMinute"),
                },
              },
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID.split("|")[1],
                    Name: this.props.match.params.locationName.split("|")[1],
                    CountryID: this.props.match.params.countryID.split("|")[1],
                    Type: this.getFilterValue("DropoffType"),
                  },
                },
                DateInfo: {
                  StartDate: this.props.match.params.checkInDate + "T00:00:00",
                  EndDate:
                    this.getFilterValue("TripType") === "oneway"
                      ? this.props.match.params.checkInDate + "T00:00:00"
                      : this.props.match.params.checkOutDate + "T00:00:00",
                  StartTime:
                    this.getFilterValue("TripType") === "roundtrip"
                      ? this.getFilterValue("TransfersReturnStartHour")
                      : this.getFilterValue("TransfersStartHour"), //this.getFilterValue("TransfersStartHour") + ":" + this.getFilterValue("TransfersStartMinute"),
                  EndTime:
                    this.getFilterValue("TripType") === "roundtrip"
                      ? this.getFilterValue("TransfersReturnStartMinute")
                      : this.getFilterValue("TransfersStartMinute"), //+ ":" + this.getFilterValue("TransfersStartMinute"),
                },
              },
            ],
            PaxInfo: [
              {
                Item: [...Array(this.props.match.params.roomDetails.split(",").length).keys()].map(
                  (item) => {
                    return {
                      TypeString: "ADT",
                      Quantity: 1,
                      Age: "28",
                    };
                  }
                ),
              },
            ],
            Filters: this.getFilterRequestObject(),
            TripType: this.getFilterValue("TripType"),
            Status: "Available",
            Code: "transfers",
            Business: "transfers",
            BusinessId: "9",
          },
        };
        break;
      case "vehicle":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: this.props.match.params.locationID.split("|")[0],
                    Name: this.props.match.params.locationName.split("|")[0],
                    CountryID: this.props.match.params.countryID.split("|")[0],
                  },
                  ToLocation: {
                    ID: this.props.match.params.locationID.split("|")[1],
                    Name: this.props.match.params.locationName.split("|")[1],
                    CountryID: this.props.match.params.countryID.split("|")[1],
                  },
                },
                DateInfo: {
                  StartDate:
                    this.props.match.params.checkInDate +
                    "T" +
                    this.getFilterValue("PickupHour") +
                    ":" +
                    this.getFilterValue("PickupMinute") +
                    ":00",
                  EndDate:
                    this.props.match.params.checkOutDate +
                    "T" +
                    this.getFilterValue("DropOffHour") +
                    ":" +
                    this.getFilterValue("DropOffMinute") +
                    ":00",
                },
              },
            ],
            status: "Available",
            driverAge: this.props.match.params.roomDetails,
            Filters: this.getFilterRequestObject(),
          },
        };
        break;
      default:
    }
    return reqOBJ;
  };

  getRequestObjectByRequest = (searchRequest) => {
    let reqOBJ;
    switch (searchRequest.businessName) {
      case "hotel":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.fromLocation.id,
                    Name: searchRequest.fromLocation.name,
                    CountryID: searchRequest.fromLocation.countryID,
                    Type: searchRequest.fromLocation.type,
                    commonCode: searchRequest.fromLocation.commonCode,
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                  EndDate: searchRequest.dates.checkOutDate + "T23:59:59",
                },
              },
            ],
            PaxInfo: this.getroomDetailsFromQueryString(searchRequest.pax),
            Filters: [{
              Column: "nationality",
              Query: searchRequest.nationalityCode
            }],
          },
        };
        break;

      case "activity":
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.fromLocation.id,
                    Name: searchRequest.fromLocation.name,
                    CountryID: searchRequest.fromLocation.countryID,
                    Type: searchRequest.fromLocation.type,
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T17:59:44",
                  EndDate: searchRequest.dates.checkOutDate + "T17:59:44",
                },
              },
            ],
            PaxInfo: [
              {
                Item: searchRequest.pax.map((item) => {
                  return {
                    TypeString: "ADT",
                    Quantity: 1,
                    Age: item,
                  };
                }),
              },
            ],
            Filters: [],
            Status: "Available",
            Code: "Activity",
            Business: "activity",
          },
        };
        break;

      case "air":
        let quantity_ADT = searchRequest.pax.find((x) => x.type === "ADT").count;
        let quantity_CHD = searchRequest.pax.find((x) => x.type === "CHD").count;
        let quantity_INF = searchRequest.pax.find((x) => x.type === "INF").count;
        let tripDirection = searchRequest.tripDirection.toLowerCase() === "roundtrip" ? "roundtrip" : "oneway";

        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.fromLocation.id,
                    Name: searchRequest.fromLocation.address,
                    CountryID: searchRequest.fromLocation.countryID,
                    Type: "Location",
                  },
                  toLocation: {
                    ID: searchRequest.toLocation.id,
                    Name: searchRequest.toLocation.address,
                    CountryID: searchRequest.toLocation.countryID,
                    Type: "Location",
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                  EndDate:
                    tripDirection === "oneway"
                      ? searchRequest.dates.checkInDate + "T00:00:00"
                      : searchRequest.dates.checkOutDate + "T00:00:00",
                },
                SequenceNumber: 1,
              },
            ],
            PaxInfo: [
              {
                Item: [
                  {
                    TypeString: "ADT",
                    Quantity: quantity_ADT,
                  },
                  {
                    TypeString: "CHD",
                    Quantity: quantity_CHD,
                  },
                  {
                    TypeString: "INF",
                    Quantity: quantity_INF,
                  },
                ],
              },
            ],
            VendorCriteria: null,
            Filters: [],
            TripType: tripDirection,
          },
          Flags: {
            //"feature:disableseparateroundtrip": true,
          },
        };
        break;

      case "transportation":
        let optsTransportation = [{
          Column: "quantity",
          Query: searchRequest.transportation_NoOfVehicle.toString(),
        }];

        if (searchRequest?.transportation_Companies) {
          optsTransportation.push({
            Column: "companies",
            Query: searchRequest?.transportation_Companies.toString(),
          })
        }

        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.transportation_Route,
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                },
              },
            ],
            PaxInfo: [
              {
                Item: [
                  {
                    Quantity: searchRequest.transportation_NoOfPerson.toString(),
                  }
                ]
              }
            ],
            Filters: optsTransportation,
            Status: "Available",
            Code: "transportation",
            Business: "activity",
          },
        };
        break;

      case "transfers":
        let tripDirectionTransfers = searchRequest.tripDirection.toLowerCase() === "roundtrip"
          ? "roundtrip"
          : "oneway";
        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.fromLocation.id,
                    Name: searchRequest.fromLocation.name,
                    CountryID: searchRequest.fromLocation.countryID,
                    Type: searchRequest.transfer_PickupType,
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                  EndDate:
                    tripDirectionTransfers === "oneway"
                      ? searchRequest.dates.checkInDate + "T00:00:00"
                      : searchRequest.dates.checkOutDate + "T00:00:00",
                  StartTime: searchRequest.transfer_Hour.split(":")[0],
                  EndTime: searchRequest.transfer_Hour.split(":")[1],
                },
              },
              {
                LocationInfo: {
                  FromLocation: {
                    ID: searchRequest.toLocation.id,
                    Name: searchRequest.toLocation.name,
                    CountryID: searchRequest.toLocation.countryID,
                    Type: searchRequest.transfer_DropoffType,
                  },
                },
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                  EndDate:
                    tripDirectionTransfers === "oneway"
                      ? searchRequest.dates.checkInDate + "T00:00:00"
                      : searchRequest.dates.checkOutDate + "T00:00:00",
                  StartTime:
                    tripDirectionTransfers === "oneway"
                      ? searchRequest.transfer_Hour.split(":")[0]
                      : searchRequest.transfer_Hour.split(":")[1],
                  EndTime:
                    tripDirectionTransfers === "oneway"
                      ? searchRequest.transfer_ReturnHour.split(":")[0]
                      : searchRequest.transfer_ReturnHour.split(":")[1],
                },
              },
            ],
            PaxInfo: [
              {
                Item: searchRequest.pax.map((item) => {
                  return {
                    TypeString: "ADT",
                    Quantity: 1,
                    Age: "28",
                  };
                }),
              },
            ],
            Filters: [],
            TripType: tripDirectionTransfers,
            Status: "Available",
            Code: "transfers",
            Business: "transfers",
            BusinessId: "9",
          },
        };
        break;
      case "groundservice":
        let optsGroundservice = [{
          Column: "UserCountryOfResidence",
          Query: searchRequest.groundservice_CountryofResidence,
        },
        {
          Column: "UserNationality",
          Query: searchRequest.groundservice_nationalityCode,
        }];

        if (searchRequest.groundservice_Category) {
          optsGroundservice.push({
            Query: "category",
            Column: searchRequest.groundservice_Category,
          });
        }
        if (searchRequest.groundservice_UOCompanies) {
          optsGroundservice.push({
            Query: "uocompany",
            Column: searchRequest.groundservice_UOCompanies,
          });
        }
        if (searchRequest.groundservice_AdditionalServices?.filter(x => x.Selected).length > 0) {
          searchRequest.groundservice_AdditionalServices.filter(x => x.Selected).map((item) => {
            optsGroundservice.push({
              Query: "additionalservices",
              Column: item.id,
              Min: item.Quantity,
              Max: item.Duration,
            });
            return 0;
          });
        }

        reqOBJ = {
          Request: {
            CriteriaInfo: [
              {
                DateInfo: {
                  StartDate: searchRequest.dates.checkInDate + "T00:00:00",
                  EndDate: searchRequest.dates.checkInDate + "T00:00:00",
                },
              },
            ],
            PaxInfo: [
              {
                Item: [{
                  Quantity: searchRequest.transportation_NoOfPerson,
                }
                ]
              },
            ],
            Filters: optsGroundservice,
            Status: "Available",
            Code: "groundservice",
            Business: "activity",
          },
        };
        break;

      default:
    }
    return reqOBJ;
  };

  getFilterRequestObject = () => {
    let returnValue = [];

    //ACPercentage
    if (
      Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
      (Global.getEnvironmetKeyValue("HIDEADDITIONALCOMMISSIONPERCENTAGE", "cobrand") === null ||
        Global.getEnvironmetKeyValue("HIDEADDITIONALCOMMISSIONPERCENTAGE", "cobrand") ===
        "false") &&
      this.getFilterValue("ACPercentage") !== ""
    )
      returnValue.push({
        Column: "additionalmarkuppercentage",
        Query: this.getFilterValue("ACPercentage"),
      });

    //hotel : nationalityCode
    if (
      Global.getEnvironmetKeyValue("SETHOTELDEFAULTNATIONALITY", "cobrand") === "true" &&
      this.getFilterValue("nationalityCode") !== ""
    )
      returnValue.push({
        Column: "nationality",
        Query: this.getFilterValue("nationalityCode"),
      });

    //hotel : subPCCCode
    if (
      Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
      this.getFilterValue("subPCCCode") !== ""
    )
      returnValue.push({
        Column: "agentidentificationcode",
        Query: this.getFilterValue("subPCCCode"),
      });

    //hotel : specialCode
    if (
      Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
      this.getFilterValue("specialCode") !== ""
    )
      returnValue.push({
        Column: "specialcode",
        Query: this.getFilterValue("specialCode"),
      });

    //Transportation
    if (this.state.businessName === "transportation") {
      returnValue.push({
        Column: "quantity",
        Query: this.props.match.params.countryID,
      });

      if (this.getFilterValue("companies") !== "")
        returnValue.push({
          Column: "companies",
          Query: this.getFilterValue("companies"),
        });
    }

    //GroundService
    if (this.state.businessName === "groundservice") {
      returnValue.push({
        Column: "UserNationality",
        Query: this.getFilterValue("nationality"),
      });
      returnValue.push({
        Column: "UserCountryOfResidence",
        Query: this.getFilterValue("countryofresidence"),
      });
      returnValue.push({
        Query: "category",
        Column: this.getFilterValue("category"),
      });
      returnValue.push({
        Query: "uocompany",
        Column: this.getFilterValue("companies"),
      });
      let getadditionalservice = this.getFilterValue("additionalservices");
      if (getadditionalservice !== "") {
        let additionalservices = getadditionalservice.split(",");
        additionalservices.map((item) => {
          returnValue.push({
            Query: "additionalservices",
            Column: item.split("_")[0],
            Min: item.split("_")[1],
            Max: item.split("_")[2],
          });
        });
      }
    }

    //Air
    if (this.state.businessName === "air") {
      if (this.getFilterValue("directflight") !== "")
        returnValue.push({
          Column: "nonStopOnly",
          Query: this.getFilterValue("directflight"),
        });
      if (this.getFilterValue("refundable") !== "")
        returnValue.push({
          Column: "refundableFlightsOnly",
          Query: this.getFilterValue("refundable"),
        });
      if (this.getFilterValue("cabinclass") !== "")
        returnValue.push({
          Column: "seattype",
          Query: this.getFilterValue("cabinclass"),
        });
    }

    //Vehicle
    if (this.state.businessName === "vehicle") {
      if (this.getFilterValue("PromotionProviderID") !== "")
        returnValue.push({
          Column: "PromotionProviderID",
          Query: this.getFilterValue("PromotionProviderID"),
        });
      if (this.getFilterValue("PromotionProviderName") !== "")
        returnValue.push({
          Column: "PromotionProviderName",
          Query: this.getFilterValue("PromotionProviderName"),
        });
      if (this.getFilterValue("PromotionCode") !== "")
        returnValue.push({
          Column: "PromotionCode",
          Query: this.getFilterValue("PromotionCode").replace("&", "^AMPERSAND^").replace("'", "^APOS^"),
        });
    }

    return returnValue;
  };

  getFilterValue = (filter) => {
    if (this.props.match.params.filters === "filters") return "";
    else if (this.props.match.params.filters.split("|").find((x) => x.startsWith(filter + "="))) {
      return this.props.match.params.filters
        .split("|")
        .find((x) => x.startsWith(filter + "="))
        .replace(filter + "=", "");
    } else return "";
  };

  filterResults = (filterSortBy, isResetFilter) => {
    let code = "default";

    this.setState({
      isFilterLoading: true,
      filterToken: isResetFilter ? "true" : this.state.filterToken,
      filterCurrencySymbol:
        filterSortBy.length === 0
          ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            : "$"
          : Array.isArray(filterSortBy) && filterSortBy.find((x) => x.name === "currency")
            ? Global.getEnvironmetKeyValue("availableCurrencies").find(
              (x) => x.isoCode === filterSortBy.find((x) => x.name === "currency").defaultValue
            ).symbol
            : this.state.filterCurrencySymbol,
    });

    let appliedFiltersIndex =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === code).item;

    let appliedSortingIndex =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === code).item;

    var reqURL = "api/v1/" + this.state.businessName + "/search/page";

    let reqOBJ = {
      Request:
        filterSortBy !== undefined
          ? Array.isArray(filterSortBy)
            ? {
              FiltersIndex: [{ Code: code, Item: filterSortBy }],
              SortIndex: [{ Code: code, Item: appliedSortingIndex }],
              Token: this.state.token,
            }
            : {
              SortIndex: [{ Code: code, Item: filterSortBy }],
              FiltersIndex: [{ Code: code, Item: appliedFiltersIndex }],
              Token: this.state.token,
            }
          : null,
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.hideQuickBook();
        this.setState({
          results: data.response,
          isLoading: false,
          isFilterLoading: false,
          filterToken: this.state.filterToken === "true" ? data.info.token : this.state.filterToken,
        });
      }.bind(this)
    );
  };

  paginationResults = (pageCount) => {
    let code = "default";

    let appliedFiltersIndex =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === code).item;

    let appliedSortingIndex =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === code).item;

    var reqURL = "api/v1/" + this.state.businessName + "/search/page";
    let reqOBJ = {
      Request: {
        Token: this.state.token,
        FiltersIndex: [{ Code: code, Item: appliedFiltersIndex }],
        SortIndex: [{ Code: code, Item: appliedSortingIndex }],
        PageInfoIndex: [
          {
            Code: code,
            Item: {
              CurrentPage: pageCount,
              PageLength: Global.getEnvironmetKeyValue("availableBusinesses").find(
                (x) => x.name === this.state.businessName
              ).pageSize,
            },
          },
        ],
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let results = { ...this.state.results };

        results.pageInfoIndex.find((x) => x.code === code).item = data.response.pageInfoIndex.find(
          (x) => x.code === code
        ).item;

        results.data.find((x) => x.code === code).item = results.data
          .find((x) => x.code === code)
          .item.concat(data.response.data.find((x) => x.code === code).item);

        this.setState({
          results,
          isLoading: false,
        });
      }.bind(this)
    );
  };

  // Domestic RoundTrip
  filterResultsDomesticDepart = (filterSortBy, isResetFilter) => {
    let code = "departure";
    let codeApplied = "arrival";

    this.setState({
      isFilterLoading: true,
      filterToken: isResetFilter ? "true" : this.state.filterToken,
      filterCurrencySymbol:
        filterSortBy.length === 0
          ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            : "$"
          : Array.isArray(filterSortBy) && filterSortBy.find((x) => x.name === "currency")
            ? Global.getEnvironmetKeyValue("availableCurrencies").find(
              (x) => x.isoCode === filterSortBy.find((x) => x.name === "currency").defaultValue
            ).symbol
            : this.state.filterCurrencySymbol,
    });

    let appliedFiltersIndex =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === code).item;

    let appliedSortingIndex =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === code).item;

    let appliedFiltersIndexApplied =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === codeApplied).item;

    let appliedSortingIndexApplied =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === codeApplied).item;

    var reqURL = "api/v1/" + this.state.businessName + "/search/page";

    let reqOBJ = {
      Request:
        filterSortBy !== undefined
          ? Array.isArray(filterSortBy)
            ? {
              FiltersIndex: [
                { Code: code, Item: filterSortBy },
                {
                  Code: codeApplied,
                  Item: !isResetFilter ? appliedFiltersIndexApplied : filterSortBy,
                },
              ],
              SortIndex: [
                { Code: code, Item: appliedSortingIndex },
                { Code: codeApplied, Item: appliedSortingIndexApplied },
              ],
              Token: this.state.token,
            }
            : {
              SortIndex: [
                { Code: code, Item: filterSortBy },
                { Code: codeApplied, Item: appliedSortingIndexApplied },
              ],
              FiltersIndex: [
                { Code: code, Item: appliedFiltersIndex },
                { Code: codeApplied, Item: appliedFiltersIndexApplied },
              ],
              Token: this.state.token,
            }
          : null,
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.hideQuickBook();
        this.setState({
          results: data.response,
          isLoading: false,
          isFilterLoading: false,
          filterToken: this.state.filterToken === "true" ? data.info.token : this.state.filterToken,
        });
      }.bind(this)
    );
  };

  filterResultsDomesticReturn = (filterSortBy, isResetFilter) => {
    let code = "arrival";
    let codeApplied = "departure";

    this.setState({
      isFilterLoading: true,
      filterToken: isResetFilter ? "true" : this.state.filterToken,
      filterCurrencySymbol:
        filterSortBy.length === 0
          ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            ? Global.getEnvironmetKeyValue("portalCurrencySymbol")
            : "$"
          : Array.isArray(filterSortBy) && filterSortBy.find((x) => x.name === "currency")
            ? Global.getEnvironmetKeyValue("availableCurrencies").find(
              (x) => x.isoCode === filterSortBy.find((x) => x.name === "currency").defaultValue
            ).symbol
            : this.state.filterCurrencySymbol,
    });

    let appliedFiltersIndex =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === code).item;

    let appliedSortingIndex =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === code).item;

    let appliedFiltersIndexApplied =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === codeApplied).item;

    let appliedSortingIndexApplied =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === codeApplied).item;

    var reqURL = "api/v1/" + this.state.businessName + "/search/page";

    let reqOBJ = {
      Request:
        filterSortBy !== undefined
          ? Array.isArray(filterSortBy)
            ? {
              FiltersIndex: [
                { Code: code, Item: filterSortBy },
                { Code: codeApplied, Item: appliedFiltersIndexApplied },
              ],
              SortIndex: [
                { Code: code, Item: appliedSortingIndex },
                { Code: codeApplied, Item: appliedSortingIndexApplied },
              ],
              Token: this.state.token,
            }
            : {
              SortIndex: [
                { Code: code, Item: filterSortBy },
                { Code: codeApplied, Item: appliedSortingIndexApplied },
              ],
              FiltersIndex: [
                { Code: code, Item: appliedFiltersIndex },
                { Code: codeApplied, Item: appliedFiltersIndexApplied },
              ],
              Token: this.state.token,
            }
          : null,
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.hideQuickBook();
        this.setState({
          results: data.response,
          isLoading: false,
          isFilterLoading: false,
          filterToken: this.state.filterToken === "true" ? data.info.token : this.state.filterToken,
        });
      }.bind(this)
    );
  };

  paginationResultsDomestic = (pageCount, routeType) => {
    let code = routeType;

    let appliedFiltersIndex =
      this.state.results.appliedFiltersIndex !== undefined &&
      this.state.results.appliedFiltersIndex.find((x) => x.code === code).item;

    let appliedSortingIndex =
      this.state.results.appliedSortingIndex !== undefined &&
      this.state.results.appliedSortingIndex.find((x) => x.code === code).item;

    var reqURL = "api/v1/" + this.state.businessName + "/search/page";
    let reqOBJ = {
      Request: {
        Token: this.state.token,
        FiltersIndex: [{ Code: code, Item: appliedFiltersIndex }],
        SortIndex: [{ Code: code, Item: appliedSortingIndex }],
        PageInfoIndex: [
          {
            Code: code,
            Item: {
              CurrentPage: pageCount,
              PageLength: Global.getEnvironmetKeyValue("availableBusinesses").find(
                (x) => x.name === this.state.businessName
              ).pageSize,
            },
          },
        ],
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let results = { ...this.state.results };

        results.pageInfoIndex.find((x) => x.code === code).item = data.response.pageInfoIndex.find(
          (x) => x.code === code
        ).item;

        results.data.find((x) => x.code === code).item = results.data
          .find((x) => x.code === code)
          .item.concat(data.response.data.find((x) => x.code === code).item);

        this.setState({
          results,
          isLoading: false,
        });
      }.bind(this)
    );
  };

  changeView = (view) => {
    if (view === "mapview")
      this.setState({
        currentMapView: !this.state.currentMapView,
        currentMapViewItem: null,
      });
    else
      this.setState({
        currentView: view,
        currentMapViewItem: null,
      });
  };

  mapByItem = (view, item) => {
    scroll.scrollTo(200);
    if (view === "mapview")
      this.setState({
        currentMapView:
          this.state.currentMapViewItem !== undefined && this.state.currentMapViewItem !== null
            ? item.id === this.state.currentMapViewItem.item.id
              ? this.state.currentMapView
                ? false
                : true
              : true
            : true, //  !this.state.currentMapView,
        currentMapViewItem: { item },
      });
    else
      this.setState({
        currentView: view,
        currentMapViewItem: null,
      });
  };

  getroomDetailsFromQueryString = (data) => {
    var paxInfo = [];
    let roomInfo = !this.state.isRouteMode ? this.getRoomInfoFromQueryString(data) : data;

    if (localStorage.getItem("isUmrahPortal")) {
      for (let i = 0; i < roomInfo.length; i++) {
        for (let j = 0; j < roomInfo[i].noOfRooms; j++) {
          var itemArr = [];
          itemArr.push({
            typeString: "ADT",
            quantity: roomInfo[i].noOfAdults,
            age: null,
          });

          for (let k = 0; k < roomInfo[i].noOfChild; k++) {
            itemArr.push({
              typeString: "CHD",
              quantity: 1,
              age: 10,
            });
          }

          paxInfo.push({
            code: null,
            sequence: 0,
            type: null,
            properties: {},
            config: [],
            flags: {},
            item: itemArr,
          });
        }
      }
    } else {
      roomInfo.forEach(function (e, a) {
        var itemArr = [];
        if (e.noOfAdults > 0) {
          var item = {
            typeString: "ADT",
            quantity: e.noOfAdults,
            age: null,
          };
          itemArr.push(item);
        }
        var i;
        for (i = 0; i < e.noOfChild; i++) {
          item = {
            typeString: "CHD",
            quantity: 1,
            age: e.childAge[i],
          };
          itemArr.push(item);
        }
        var paxDetail = {
          code: null,
          sequence: paxInfo.length,
          type: null,
          properties: {},
          config: [],
          flags: {},
          item: itemArr,
        };
        paxInfo.push(paxDetail);
      });
    }
    return paxInfo;
  };

  getRoomInfoFromQueryString = (data) => {
    var strArray = data.split("|");
    var roomInfo = [];
    if (localStorage.getItem("isUmrahPortal")) {
      roomInfo = strArray.map((room, key) => {
        return {
          groupID: (key === 0 ? key + 1 : key),
          noOfRooms: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofrooms"))
              .replace("noofrooms=", "")
          ),
          noOfAdults: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofadults"))
              .replace("noofadults=", "")
          ),
          noOfChild: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofchild"))
              .replace("noofchild=", "")
          ),
        };
      });
    } else {
      var noofroom = parseInt(
        strArray.find((element) => element.startsWith("noofrooms")).replace("noofrooms=", "")
      );

      for (let i = 0; i < noofroom; i++) {
        var objroom = {
          roomID: i + 1,
          noOfAdults: parseInt(
            strArray
              .find((element) => element.startsWith("room" + (i + 1) + "noOfAdults="))
              .replace("room" + (i + 1) + "noOfAdults=", "")
          ),
          noOfChild: parseInt(
            strArray
              .find((element) => element.startsWith("room" + (i + 1) + "noOfChild="))
              .replace("room" + (i + 1) + "noOfChild=", "")
          ),
          childAge: strArray
            .find((element) => element.startsWith("room" + (i + 1) + "childage="))
            .replace("room" + (i + 1) + "childage=", "")
            .split(","),
        };
        roomInfo.push(objroom);
      }
    }
    return roomInfo;
  };

  getHotelRoomData = () => {
    return {
      fromLocation: [
        {
          name: this.props.match.params.locationName,
          id: this.props.match.params.locationID.split("|")[0],
          CountryID: this.props.match.params.countryID.split("_")[2],
          latitude: 0,
          longitude: 0,
          priority: 1,
          Type:
            this.props.match.params.businessName === "transfers"
              ? this.getFilterValue("PickupType")
              : this.props.match.params.countryID.split("_")[1],
          commonCode: this.props.match.params.countryID.split("_")[0],
        },
      ],
      dates: {
        checkInDate: this.props.match.params.checkInDate,
        checkOutDate: this.props.match.params.checkOutDate,
      },
      pax:
        this.props.match.params.businessName === "hotel"
          ? this.getroomDetailsFromQueryString(this.props.match.params.roomDetails)
          : this.props.match.params.businessName === "activity" ||
            this.props.match.params.businessName === "package"
            ? [
              {
                item: this.props.match.params.roomDetails.split(",").map((item) => {
                  return {
                    typeString: "ADT",
                    quantity: 1,
                    age: item,
                  };
                }),
              },
            ]
            : this.props.match.params.businessName === "transfers"
              ? [
                {
                  Item: [...Array(this.props.match.params.roomDetails.split(",").length).keys()].map(
                    (item) => {
                      return {
                        TypeString: "ADT",
                        Quantity: 1,
                        Age: "28",
                      };
                    }
                  ),
                },
              ]
              : [],
    };
  };
  // Details Screen
  getDetails = () => {
    var reqURL = "api/v1/" + this.state.businessName + "/details";
    var requestdata = this.getHotelRoomData();

    let config = [];
    config.push({
      key: "code",
      value: this.props.match.params.id,
    });
    config.push({
      key: "providerName",
      value: this.props.match.params.provider.split("|")[0],
    });
    if (this.props.match.params.provider.indexOf("|")) {
      config.push({
        key: "token",
        value: this.props.match.params.provider.split("|")[1],
      });
    }
    if (this.props.match.params.overridesupplier === "true") {
      config.push({
        key: "overrideProviders",
        value: this.props.match.params.provider.split("|")[0],
      });
    }

    var reqOBJ;
    if (this.props.match.params.overridesupplier === "false") {
      reqOBJ = {
        searchInfo: {
          Token: this.props.match.params.token,
          config: config,
          criteriaInfo: [
            {
              locationInfo: {
                fromLocation: {
                  id:
                    requestdata.fromLocation[0].Type &&
                      requestdata.fromLocation[0].Type.toLowerCase() === "hotel"
                      ? requestdata.fromLocation[0].id.indexOf("_") > 0
                        ? requestdata.fromLocation[0].id.split("_")[0]
                        : requestdata.fromLocation[0].id
                      : requestdata.fromLocation[0].id,
                  Type:
                    requestdata.fromLocation[0].Type &&
                      requestdata.fromLocation[0].Type.toLowerCase() === "hotel"
                      ? "Location"
                      : requestdata.fromLocation[0].Type,
                },
              },
              dateInfo: {
                startDate: requestdata.dates.checkInDate + "T00:00:00",
                endDate: requestdata.dates.checkOutDate + "T00:00:00",
              },
            },
          ],
          paxInfo: requestdata.pax,
          Filters: this.getFilterRequestObject(),
          status: "Available",
          code: this.state.businessName,
          business: this.state.businessName,
        },
        flags: { useDirectBusinessObject: true, isOverrideSearchToken: true },
      };
    }
    else {
      reqOBJ = {
        searchInfo: {
          Token: this.props.match.params.token,
          config: config,
          criteriaInfo: [
            {
              locationInfo: {
                fromLocation: {
                  id:
                    requestdata.fromLocation[0].Type &&
                      requestdata.fromLocation[0].Type.toLowerCase() === "hotel"
                      ? requestdata.fromLocation[0].id.indexOf("_") > 0
                        ? requestdata.fromLocation[0].id.split("_")[0]
                        : requestdata.fromLocation[0].id
                      : requestdata.fromLocation[0].id,
                  Type:
                    requestdata.fromLocation[0].Type &&
                      requestdata.fromLocation[0].Type.toLowerCase() === "hotel"
                      ? "Location"
                      : requestdata.fromLocation[0].Type,
                },
              },
              dateInfo: {
                startDate: requestdata.dates.checkInDate + "T00:00:00",
                endDate: requestdata.dates.checkOutDate + "T00:00:00",
              },
            },
          ],
          paxInfo: requestdata.pax,
          Filters: this.getFilterRequestObject(),
          status: "Available",
          code: this.state.businessName,
          business: this.state.businessName,
        },
        flags: { useDirectBusinessObject: true, isOverrideSearchToken: true, "feature:enableRoomsUnion": true },
      };
    }

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          details: data.response ? data.response[0].item[0] : null,
          isLoading: false,
          token: data.searchToken,
        });
        let redirectURL = this.props.match.url;
        redirectURL = redirectURL.replace(
          this.props.match.params.provider,
          this.props.match.params.provider.split("|")[0] + "|" + this.state.token
        );
        window.history.pushState(null, null, window.location.origin + "/#" + redirectURL);
      }.bind(this)
    );
  };

  getDetailsFromToken = () => {
    var reqURL = "api/v1/" + this.state.businessName + "/details";
    var reqOBJ;
    if (this.props.match.params.overridesupplier === "false") {
      reqOBJ = {
        Request: {
          Token: this.props.match.params.provider.split("|")[1],
          Data: this.props.match.params.id,
        },
        Flags: {},
      };
    }
    else {
      let config = [];
      config.push({
        key: "overrideProviders",
        value: this.props.match.params.provider.split("|")[0],
      });
      reqOBJ = {
        Request: {
          Token: this.props.match.params.provider.split("|")[1],
          Data: this.props.match.params.id,
        },
        config: { "overrideProviders": this.props.match.params.provider.split("|")[0] },
        Flags: { "feature:enableRoomsUnion": true },
      };
    }
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          details: data.response ? data.response[0].item[0] : null,
          isLoading: false,
          token: data.searchToken,
        });
      }.bind(this)
    );
  };

  handleShowPolicyPopup = () => {
    this.setState({
      showPopup: true,
      popupHeader: Trans("_bookingTermsPopupTitle"),
      popupContent: this.state.PolicyHTML,
    });
  };

  handleHidePopup = () => {
    this.setState({
      showPopup: false,
      popupHeader: null,
      popupContent: null,
    });
  };

  showRoomTerms = (isGroupedRooms, id, param_item) => {
    this.setState({
      PolicyHTML: null,
      showPopup: true,
      popupHeader: Trans("_bookingTermsPopupTitle"),
      popupContent: <Loader />,
    });
    let reqURL = "api/v1/" + this.state.businessName + "/policy";
    let reqOBJ = {
      Request: {
        Token:
          this.props?.match?.params?.provider !== undefined &&
            localStorage.getItem("IsFromDetailsPage") === null
            ? this.props.match.params.friendlyurl.toLowerCase() === "true"
              ? this.state.token
              : this.props.match.params.provider.split("|")[1] !== null
                ? this.props.match.params.provider.split("|")[1]
                : this.state.token
            : this.state.token !== undefined
              ? this.state.token
              : this.props.match.params.provider.split("|")[1],
        Data: {
          Key: this.state.showQuickBook ? this.state.showQuickBook : this.props.match.params.id,
          Value: this.state.businessName === "hotel" ? param_item.code : param_item.selectedDate,
        },
      },
      Flags: {},
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let isPolicyExist = false;
        let PolicyHTML = null;
        if (data.status.code === 0) {
          if (data.response.business === "hotel" && isGroupedRooms !== true) {
            PolicyHTML = data.response.items.map((items) => {
              return items.item.map((item) => {
                return item.policies.length > 0 ? (
                  <React.Fragment>
                    {item.policies.filter(x => x.name === "RoomPolicy").length > 0 ?
                      <React.Fragment>
                        <h6>{item.policies.filter(x => x.name === "RoomPolicy")[0].type}</h6>
                        <ul className="pl-3">
                          <li>{<HtmlParser text={item.policies.filter(x => x.name === "RoomPolicy")[0].description} />}</li>
                        </ul>
                      </React.Fragment>
                      : null}
                    {item.policies.filter(x => x.type === "Cancellation").length > 0 ?
                      <React.Fragment>
                        <h6>{item.policies.filter(x => x.type === "Cancellation")[0].type}</h6>
                        <ul className="pl-3">
                          {item.policies.filter(x => x.type === "Cancellation").map((policy) => {
                            isPolicyExist = true;
                            return (<li>{<HtmlParser text={policy.description} />}</li>)
                          })}
                        </ul>
                      </React.Fragment>
                      : null}
                    {item.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").length > 0 ?
                      item.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").map((policy) => {
                        isPolicyExist = true;
                        return (
                          <React.Fragment>
                            <h6>{policy.type}</h6>
                            <ul className="pl-3">
                              <li>{<HtmlParser text={policy.description} />}</li>
                            </ul>
                          </React.Fragment>
                        );
                      })
                      : null}

                  </React.Fragment>
                ) : (
                  <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>
                );
              });
            });
          } else if (data.response.business === "hotel" && isGroupedRooms === true) {
            if (data.response.policies.length > 0)
              isPolicyExist = true;
            PolicyHTML =
              data.response.policies.length > 0 && data.response.items[0].item.length > 0 ? (
                <React.Fragment>
                  {
                    data.response.items[0].item.map(item => {
                      return <React.Fragment>
                        {
                          item.policies.filter(x => x.name === "RoomPolicy").map((policy) => {
                            return (
                              <React.Fragment>
                                <h6 className="font-weight-bold">{policy.type}</h6>
                                <ul className="pl-3">
                                  <li>{<HtmlParser text={policy.description} />}</li>
                                </ul>
                              </React.Fragment>
                            );
                          })
                        }
                        {
                          item.policies.filter(x => x.type === "Cancellation").length > 0 ?
                            <React.Fragment>
                              <h6>{item.policies.filter(x => x.type === "Cancellation")[0].type}</h6>
                              <ul className="pl-3">
                                {item.policies.filter(x => x.type === "Cancellation").map((policy) => {
                                  isPolicyExist = true;
                                  return (<li>{<HtmlParser text={policy.description} />}</li>)
                                })}
                              </ul>
                            </React.Fragment>
                            : null
                        }
                        {
                          item.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").length > 0 &&
                          item.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").map((policy) => {
                            return (
                              <React.Fragment>
                                <h6 className="font-weight-bold">{policy.type}</h6>
                                <ul className="pl-3">
                                  <li>{<HtmlParser text={policy.description} />}</li>
                                </ul>
                              </React.Fragment>
                            );
                          })
                        }
                      </React.Fragment>
                    })
                  }
                  {
                    data.response.policies.filter(x => !x.isItemLevel).map((policy) => {
                      return (
                        policy.type !== "Cancellation" && (
                          <React.Fragment>
                            <h6 className="font-weight-bold text-capitalize">{policy.type}</h6>
                            <ul className="pl-3">
                              <li>{<HtmlParser text={policy.description} />}</li>
                            </ul>
                          </React.Fragment>
                        )
                      );
                    })
                  }
                </React.Fragment>
              ) : data.response.policies.length > 0 ? (
                <React.Fragment>
                  {
                    //data.response.policies.map(item => {
                    <React.Fragment>
                      {
                        data.response.policies.filter(x => x.name === "RoomPolicy").map((policy) => {
                          return (
                            <React.Fragment>
                              <h6 className="font-weight-bold">{policy.type}</h6>
                              <ul className="pl-3">
                                <li>{<HtmlParser text={policy.description} />}</li>
                              </ul>
                            </React.Fragment>
                          );
                        })
                      }
                      {
                        data.response.policies.filter(x => x.type === "Cancellation").length > 0 ?
                          <React.Fragment>
                            <h6>{data.response.policies.filter(x => x.type === "Cancellation")[0].type}</h6>
                            <ul className="pl-3">
                              {data.response.policies.filter(x => x.type === "Cancellation").map((policy) => {
                                isPolicyExist = true;
                                return (<li>{<HtmlParser text={policy.description} />}</li>)
                              })}
                            </ul>
                          </React.Fragment>
                          : null
                      }
                      {
                        data.response.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").length > 0 &&
                        data.response.policies.filter(x => x.name !== "RoomPolicy" && x.name !== "" && x.type !== "Cancellation").map((policy) => {
                          return (
                            <React.Fragment>
                              <h6 className="font-weight-bold">{policy.type}</h6>
                              <ul className="pl-3">
                                <li>{<HtmlParser text={policy.description} />}</li>
                              </ul>
                            </React.Fragment>
                          );
                        })
                      }
                    </React.Fragment>
                    //})
                  }
                  {
                    data.response.policies.filter(x => !x.isItemLevel).map((policy) => {
                      return (
                        policy.type !== "Cancellation" && (
                          <React.Fragment>
                            <h6 className="font-weight-bold text-capitalize">{policy.type}</h6>
                            <ul className="pl-3">
                              <li>{<HtmlParser text={policy.description} />}</li>
                            </ul>
                          </React.Fragment>
                        )
                      );
                    })
                  }
                </React.Fragment>
              ) : (
                <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>
              );
          } else if (
            data.response.business === "activity" ||
            data.response.business === "package" ||
            data.response.business === "transfers"
          ) {
            PolicyHTML =
              data.response.policies.length > 0 ? (
                data.response.policies.filter(x => x.type === "Cancellation").length > 0 ?
                  <React.Fragment>
                    <h6 className="font-weight-bold">{data.response.policies.filter(x => x.type === "Cancellation")[0].type}</h6>
                    <ul className="pl-3">
                      {data.response.policies.filter(x => x.type === "Cancellation").map((policy) => {
                        isPolicyExist = true;
                        return (<li>{<HtmlParser text={policy.description} />}</li>)
                      })}
                    </ul>
                  </React.Fragment>
                  :
                  data.response.policies.filter(x => x.name === "").map((policy) => {
                    isPolicyExist = true;
                    return (
                      <React.Fragment>
                        <h6 className="font-weight-bold">{policy.type}</h6>
                        <ul className="pl-3">
                          <li>{<HtmlParser text={policy.description} />}</li>
                        </ul>
                      </React.Fragment>
                    );
                  })
              ) : (
                <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>
              );
          }
        }
        if (!isPolicyExist) PolicyHTML = <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>;
        this.setState({
          showPopup: true,
          popupHeader: Trans("_bookingTermsPopupTitle"),
          popupContent: PolicyHTML,
        });
      }.bind(this)
    );
  };

  showPriceFarebreakup = (isGroupedRooms, param_item, itemid) => {
    this.setState({
      PolicyHTML: null,
      showPopup: true,
      popupHeader: Trans("_FareBreakupLabel"),
      popupContent: <Loader />,
    });
    let reqURL = "api/v1/farebreakup/details";
    let reqOBJ = {
      Request: {
        Token:
          this.props.match?.params.provider !== undefined &&
            localStorage.getItem("IsFromDetailsPage") === null
            ? this.props.match.params.friendlyurl.toLowerCase() === "true"
              ? this.state.token
              : this.props.match.params.provider.split("|")[1] !== null
                ? this.props.match.params.provider.split("|")[1]
                : this.state.token
            : this.state.token !== undefined
              ? this.state.token
              : this.props.match.params.provider.split("|")[1],
        Data: [
          {
            Key:
              this.props.match?.params.id !== undefined
                ? this.props.match.params.id
                : this.state.businessName === "transfers"
                  ? param_item.code.split("##")[0]
                  : itemid,
            Value: [
              this.state.businessName === "hotel"
                ? isGroupedRooms
                  ? param_item.id
                  : param_item.token
                : this.state.businessName === "transportation"
                  ? param_item
                  : this.state.businessName === "activity" ||
                    this.state.businessName === "package" ||
                    this.state.businessName === "transfers"
                    ? param_item.id //"2020-05-12T00:00:00_27031#$#0"
                    : (this.state.businessName === "vehicle" || this.state.businessName === "groundservice")
                      ? itemid
                      : param_item.selectedDate,
            ],
          },
        ],
      },
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let isFarebreakupExist = false;
        let FarebreakupHTML = null;
        if (data.status.code === 0) {
          FarebreakupHTML =
            data.response.length > 0 && data.response[0].item[0].displayRateInfo.length > 0 ? (
              <React.Fragment>
                <ul className="list-unstyled p-0 m-0">
                  {data.response[0].item[0].displayRateInfo.map((Farebreakup) => {
                    isFarebreakupExist = true;
                    return (
                      <React.Fragment>
                        <li className="row">
                          {Farebreakup.title !== undefined && Farebreakup.title !== "" ? (
                            <label className="col-5">{localStorage.getItem("isUmrahPortal") && Farebreakup.title === "VAT" ? "Tax & VAT" : Farebreakup.title}</label>
                          ) : (
                            <label className="col-5">
                              {Trans("_view" + Farebreakup.description.split(" ").join(""))}
                            </label>
                          )}

                          <b className="col-7">{Farebreakup.displayAmount}</b>
                        </li>
                      </React.Fragment>
                    );
                  })}

                  <li className="row">
                    <label className="col-5">{Trans(localStorage.getItem("isUmrahPortal") ? "_totalPrice" : "_totalPayableAmount")}</label>
                    <b className="col-7">{data.response[0].item[0].displayTotalAmount}</b>
                  </li>
                </ul>
                {this.state.businessName === "transportation" && <small>*Price indicate per vehicle rate</small>}
              </React.Fragment>
            ) : (
              <React.Fragment>{Trans("_noFarebreakupFound")}</React.Fragment>
            );
        }
        if (!isFarebreakupExist)
          FarebreakupHTML = <React.Fragment>{Trans("_noFarebreakupFound")}</React.Fragment>;
        this.setState({
          showPopup: true,
          popupHeader: Trans("_FareBreakupLabel"),
          popupContent: FarebreakupHTML,
        });
      }.bind(this)
    );
  };

  redirectToCart = (itemId, itemCode, quickBookKey, isModeQuotation, callBack, item) => {
    if (this.props.type !== "umrah-package")
      if (Global.getEnvironmetKeyValue("isCart") === false) localStorage.removeItem("cartLocalId");

    this.setState({
      isBtnLoading:
        this.state.businessName === "hotel"
          ? itemId + (itemCode !== undefined ? itemCode : "")
          : this.state.businessName === "transportation"
            ? quickBookKey + "~|~" + itemId
            : itemCode,
    });

    let reqURL =
      localStorage.getItem("cartLocalId") === null ? "api/v1/cart/create" : "api/v1/cart/add";
    var data = [];
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    if (isCRSRoomSelectionFlowEnable && this.state.businessName === "package") {
      data = [
        {
          Key: itemId,
          Value: itemCode,
          activityUnits: item.options,
          description: item.name.option
        },
      ];
      item = undefined;
    }
    else if (itemCode == null && this.state.businessName === "hotel") {
      data = itemId.map((i, j) => {
        return {
          Key: quickBookKey ? quickBookKey : this.props.match.params.id,
          Value: i.groupid,
          SecondaryBusinessObjectItemId: i.roomCode,
        };
      });
    } else if (this.state.businessName === "transportation") {
      data = itemCode.map((item) => {
        return {
          businessObjectId: quickBookKey,
          businessObjectItemId: item.code,
          Key: quickBookKey,
          Value: item.code,
          Quantity: item.vehicle,
          Capacity: item.pax,
        };
      });
    } else if (this.state.businessName === "groundservice") {
      data = [
        {
          Key: itemCode,
          Value: itemId,
        },
      ];
    } else if (this.state.businessName === "vehicle") {
      let dataelement = [];
      if (itemCode.item.length > 0) {
        itemCode.item.map((item) => {
          if (item.selected === true) {
            dataelement.push({
              businessObjectId: itemId,
              Key: itemId,
              businessObjectItemId: item.selectedDate,
              Value: item.selectedDate,
              Quantity: item.quantity,
            });
          }
        });
      }
      data = dataelement;
      if (data.length === 0) {
        data = [
          {
            businessObjectId: itemId,
            Key: itemId,
          },
        ];
      }
    } else {
      data = [
        {
          Key:
            this.state.businessName !== "air"
              ? quickBookKey
                ? quickBookKey
                : this.props.match.params.id
              : itemId,
          Value: itemId,
          SecondaryBusinessObjectItemId: itemCode,
        },
      ];
    }
    let reqOBJ = {
      Request: {
        CartID:
          localStorage.getItem("cartLocalId") === "undefined"
            ? null
            : localStorage.getItem("cartLocalId"),
        Token:
          !isModeQuotation &&
            this.props.match.params.provider !== undefined &&
            localStorage.getItem("IsFromDetailsPage") === null
            ? this.props.match.params.provider.split("|")[1]
            : this.state.token !== undefined
              ? this.state.token
              : this.props.match.params.provider.split("|")[1],
        Data: data,
      },
    };
    if (item)
      item = item.substring(0, item.length - 1) + ', "removeRequest":' + JSON.stringify(reqOBJ) + '}';
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        //if (data.status.code === 0) {
        if (localStorage.getItem("cartLocalId") === null) {
          localStorage.setItem("cartLocalId", data.response);
        }
        // if (localStorage.getItem("IsFromDetailsPage") !== "")
        //   localStorage.removeItem("IsFromDetailsPage");
        // this.props.history.push(`/Cart`);
        // If isModeQuotation true then not redirect to cart
        !isModeQuotation && this.props.history.push(`/Cart`);
        if (item) {
          let objItem = JSON.parse(item);
          objItem.removeRequest.Request.CartID = localStorage.getItem("cartLocalId");
          this.showhideResults();
          this.hideQuickBook();
          this.setState({
            isBtnLoading: false
          });
          callBack(objItem);
        }
        /*
      } else {
          this.setState({
            showPopup: true,
            popupHeader: Trans("_ooops"),
            popupContent: (
              <div>
                {Trans(
                  data.status.code === 260030
                    ? "_error_260030_" + this.state.businessName
                    : "_ooopsSomeThingWentWrong"
                )}
              </div>
            ),
            isBtnLoading: false,
            isBtnLoadingFor: null
          });
        }
        */
      }.bind(this)
    );
  };

  // Domestic Roundtrip
  redirectToCartDomestic = (itemId, itemCode, quickBookKey, isModeQuotation) => {
    if (Global.getEnvironmetKeyValue("isCart") === false) localStorage.removeItem("cartLocalId");

    this.setState({
      isBtnLoading: itemCode,
    });

    let reqURL =
      localStorage.getItem("cartLocalId") === null ? "api/v1/cart/create" : "api/v1/cart/add";
    var data = [];

    data = [
      {
        Key: itemCode[0],
        Value: itemCode[0],
      },
      {
        Key: itemCode[1],
        Value: itemCode[1],
      },
    ];

    let reqOBJ = {
      Request: {
        CartID:
          localStorage.getItem("cartLocalId") === "undefined"
            ? null
            : localStorage.getItem("cartLocalId"),
        Token:
          !isModeQuotation &&
            this.props.match.params.provider !== undefined &&
            localStorage.getItem("IsFromDetailsPage") === null
            ? this.props.match.params.provider.split("|")[1]
            : this.state.token !== undefined
              ? this.state.token
              : this.props.match.params.provider.split("|")[1],
        Data: data,
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (localStorage.getItem("cartLocalId") === null) {
          localStorage.setItem("cartLocalId", data.response);
        }
        !isModeQuotation && this.props.history.push(`/Cart`);
      }.bind(this)
    );
  };

  GetAminitiesLength = (param_amenities) => {
    let count = 0;
    param_amenities.map((amenity, key) => {
      mapping[amenity.name.toLowerCase()] && count++;
      return true;
    });
    return count;
  };

  scrollToElement = (element) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 200,
      smooth: "easeInOutQuart",
      offset: -5,
    });
  };

  //Quick Book
  handleQuickBook = (id, item) => {
    this.setState(
      {
        showQuickBook: id,
        details: "",
        isDetailsResponseLoading: true,
      },
      () => {
        this.scrollToElement("item" + id);
      }
    );

    if (this.state.businessName !== "vehicle" && this.state.businessName !== "transportation" && this.state.businessName !== "groundservice") {
      var reqURL = "api/v1/" + this.state.businessName + "/details";
      var reqOBJ = {
        Request: {
          Token: this.state.token,
          Data: id,
        },
        Flags: {},
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.setState({
            details: data.response ? data.response[0].item[0] : "",
            isLoading: false,
            isDetailsResponseLoading: false,
          });
        }.bind(this)
      );
    } else if (this.state.businessName === "vehicle") {
      this.setState({
        details: item,
        isLoading: false,
        isDetailsResponseLoading: false,
      });
    }
  };

  hideQuickBook = () => {
    this.setState({
      showQuickBook: false,
      isDetailsLoading: true,
    });
  };

  showVehicletermsCondition = (itemtoken) => {
    this.setState({
      PolicyHTML: null,
      showPopup: true,
      popupHeader: Trans("_jumpToTermsAndConditions"),
      popupContent: <Loader />,
    });
    var reqURL = "api/v1/" + this.state.businessName + "/policy";
    var reqOBJ = {
      Request: {
        Token: this.state.token,
        Data: { key: itemtoken },
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let isPolicyExist = false;
        let PolicyHTML = null;
        if (data.status.code === 0) {
          PolicyHTML = data.response.policies.map((items) => {
            isPolicyExist = true;
            return (
              <React.Fragment>
                <h6>{items.type}</h6>
                <HtmlParser text={items.description} />
              </React.Fragment>
            );
          });
        }
        if (!isPolicyExist) PolicyHTML = <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>;
        this.setState({
          showPopup: true,
          popupHeader: Trans("_jumpToTermsAndConditions"),
          popupContent: PolicyHTML,
        });
      }.bind(this)
    );
  };

  showRentalConditions = (itemtoken) => {
    this.setState({
      PolicyHTML: null,
      showPopup: true,
      popupHeader: Trans("RentalConditionslabel"),
      popupContent: <Loader />,
    });
    var reqURL = "api/v1/" + this.state.businessName + "/farerules";
    var reqOBJ = {
      Request: {
        Token: this.state.token,
        Data: itemtoken,
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let isPolicyExist = false;
        let PolicyHTML = null;
        if (data.status.code === 0) {
          isPolicyExist = true;
          PolicyHTML = data.response.map((items) => {
            return (
              <React.Fragment>
                <div>
                  <h6>{items.name}</h6>
                  {items.item.map((item) => {
                    return <HtmlParser text={item.value} />;
                  })}
                </div>
              </React.Fragment>
            );
          });
        }
        if (!isPolicyExist) {
          PolicyHTML = <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>;
        } else {
          PolicyHTML = PolicyHTML;
        }
        this.setState({
          showPopup: true,
          popupHeader: Trans("RentalConditionslabel"),
          popupContent: <VehicleRentalConditionContent rentalcontenthtml={PolicyHTML} />,
        });
      }.bind(this)
    );
  };

  redirectToDetail = (urlPath, itemid, providerName, item, notfrombooknow) => {
    if (this.state.businessName === "transportation") return;
    if (this.state.businessName === "hotel" && localStorage.getItem("isUmrahPortal") && notfrombooknow) {
      window.open(window.location.origin + "/#" + urlPath.replace("Results", "Details") +
        "/" +
        itemid +
        "/" +
        providerName +
        (item.config.find((x) => x.key === "ActivityToken") !== undefined
          ? "|" + item.config.find((x) => x.key === "ActivityToken").value
          : "|" + this.state.token)
        + "/false" + "/false", "_blank");
    }
    else {
      this.props.history.push(
        urlPath.replace("Results", "Details") +
        "/" +
        itemid +
        "/" +
        providerName +
        (item.config.find((x) => x.key === "ActivityToken") !== undefined
          ? "|" + item.config.find((x) => x.key === "ActivityToken").value
          : "|" + this.state.token)
        + "/false" + "/false"
      );
    }
  };

  redirectToDetailWithSupplierOverride = (urlPath, itemid, providerName, item, notfrombooknow) => {
    if (this.state.businessName === "transportation") return;
    if (this.state.businessName === "hotel" && localStorage.getItem("isUmrahPortal") && notfrombooknow) {
      window.open(window.location.origin + "/#" + urlPath.replace("Results", "Details") +
        "/" +
        itemid +
        "/" +
        providerName +
        (item.config.find((x) => x.key === "ActivityToken") !== undefined
          ? "|" + item.config.find((x) => x.key === "ActivityToken").value
          : "|" + this.state.token)
        + "/true" + "/false", "_blank");
    }
    else {
      this.props.history.push(
        urlPath.replace("Results", "Details") +
        "/" +
        itemid +
        "/" +
        providerName +
        (item.config.find((x) => x.key === "ActivityToken") !== undefined
          ? "|" + item.config.find((x) => x.key === "ActivityToken").value
          : "|" + this.state.token)
        + "/true" + "/false"
      );
    }
  };
  showmoredetailspopup = (header, desc) => {
    this.setState({
      showPopup: true,
      popupHeader: header,
      popupContent: <span>{desc}</span>,
    });

  };
  //Methods for Change dates and occupancies
  getchangeOccupancy_pax = (businessName) => {
    return businessName === "hotel"
      ? this.getRoomInfoFromQueryString(this.props.match.params.roomDetails)
      : businessName === "activity" || businessName === "package" || businessName === "transfers"
        ? this.props.match.params.roomDetails.split(",")
        : [];
  };

  changeOccupancy_setPax = (pax) => {
    this.setState({
      changeOccupancy_pax: pax,
    });
  };

  changeOccupancy_setDate = (startDate, endDate) => {
    this.setState({
      changeOccupancy_dates: { checkInDate: startDate, checkOutDate: endDate },
      datesIsValid: "valid",
    });
  };

  setDate = (startDate, endDate) => {
    this.setState({
      dates: { checkInDate: startDate, checkOutDate: endDate },
      datesIsValid: "valid",
    });
  };

  //for activity
  ShowHidePaxInfoPopup = () => {
    this.setState({
      isShowPaxInfoPopup: !this.state.isShowPaxInfoPopup,
    });
  };

  //Apply button
  changeDatesAndPaxAction = () => {
    //validation
    if (
      this.state.businessName === "activity" ||
      this.state.businessName === "transfers" ||
      this.state.businessName === "package"
    ) {
      //Check blank values
      var inValidPaxCount = this.state.changeOccupancy_pax.reduce(
        (sum, key) => sum + (parseInt(key === "" ? 0 : key) > 0 ? 0 : 1),
        0
      );
      //Check atlease 1 adult
      let adultCount = this.state.changeOccupancy_pax.reduce(
        (sum, key) => sum + (parseInt(key === "" ? 0 : key) > 15 ? 1 : 0),
        0
      );
      if (adultCount === 0) inValidPaxCount = 1;
      this.setState({
        changeOccupancy_paxIsValid: inValidPaxCount > 0 ? "invalid" : "valid",
      });
      if (inValidPaxCount > 0) return;
    }
    //Generate URL for redirect
    let redirectURL = this.props.match.url;
    redirectURL = redirectURL.replace(
      this.props.match.params.checkInDate,
      this.state.changeOccupancy_dates.checkInDate
    );
    redirectURL = redirectURL.replace(
      this.props.match.params.checkOutDate,
      this.state.changeOccupancy_dates.checkOutDate
    );
    if (localStorage.getItem("IsFromDetailsPage") === null) {
      localStorage.setItem("IsFromDetailsPage", "true");
    }
    if (this.state.businessName === "hotel") {
      redirectURL = redirectURL.replace(
        this.props.match.params.roomDetails,
        this.getQuerystringFromPaxObject(this.state.changeOccupancy_pax)
      );

      if (
        this.props.match.params.checkInDate !== this.state.changeOccupancy_dates.checkInDate ||
        this.props.match.params.checkOutDate !== this.state.changeOccupancy_dates.checkOutDate ||
        this.props.match.params.roomDetails !==
        this.getQuerystringFromPaxObject(this.state.changeOccupancy_pax)
      ) {
        //if (localStorage.getItem("isUmrahPortal") && this.state.businessName === "hotel")
        if (this.state.businessName === "hotel")
          redirectURL = redirectURL.replace("Results", "Details");
        else
          redirectURL = redirectURL.replace("Details", "Results");
        this.props.history.push(redirectURL);
      }
      else
        this.setState({
          showPopup: true,
          popupHeader: Trans("_ooops"),
          popupContent: <span>{Trans("_ChangeSearchCheckAvailMsg")}</span>,
        });
    } else if (
      this.state.businessName === "activity" ||
      this.state.businessName === "transfers" ||
      this.state.businessName === "package"
    ) {
      redirectURL = redirectURL.replace(
        "/" + this.props.match.params.roomDetails,
        "/" + this.state.changeOccupancy_pax.toString()
      );
      //if (this.state.businessName === "transfers")
      if (this.state.businessName === "hotel")
        redirectURL = redirectURL.replace("Results", "Details");
      else
        redirectURL = redirectURL.replace("Details", "Results");
      if (
        this.props.match.params.checkInDate !== this.state.changeOccupancy_dates.checkInDate ||
        this.props.match.params.checkOutDate !== this.state.changeOccupancy_dates.checkOutDate ||
        this.props.match.params.roomDetails !== this.state.changeOccupancy_pax.toString()
      ) {
        //if (localStorage.getItem("isUmrahPortal") && this.state.businessName === "hotel")
        if (this.state.businessName === "hotel")
          redirectURL = redirectURL.replace("Results", "Details");
        else
          redirectURL = redirectURL.replace("Details", "Results");
        this.props.history.push(redirectURL);
      }
      else
        this.setState({
          showPopup: true,
          popupHeader: Trans("_ooops"),
          popupContent: <span>{Trans("_ChangeSearchCheckAvailMsg")}</span>,
        });
    }
  };

  getQuerystringFromPaxObject = (pax) => {
    let strQS = "noofrooms=" + pax.length;
    let totalNoOfAdult = 0;
    let totalNoOfChild = 0;
    if (localStorage.getItem("isUmrahPortal")) {
      strQS = pax
        .map((item) => {
          return (
            "noofrooms=" +
            item.noOfRooms +
            ",noofadults=" +
            item.noOfAdults +
            ",noofchild=" +
            item.noOfChild
          );
        })
        .join("|");
    }
    else {
      for (var i = 0; i < pax.length; i++) {
        totalNoOfAdult += pax[i].noOfAdults;
        totalNoOfChild += pax[i].noOfChild;
        strQS += "|room" + (i + 1) + "noOfAdults=" + pax[i].noOfAdults;
        strQS += "|room" + (i + 1) + "noOfChild=" + pax[i].noOfChild;
        if (pax[i].childAge !== undefined)
          strQS += "|room" + (i + 1) + "childage=" + pax[i].childAge.toString().replace(/<1/g, "0");
      }
      strQS += "|totalNoOfAdult=" + totalNoOfAdult + "|totalNoOfChild=" + totalNoOfChild;
    }
    return strQS;
  };

  getMapData = (data) => {
    if (Array.isArray(data))
      return data
        .filter(
          (item) =>
            item.latitude !== undefined &&
            item.latitude !== "" &&
            item.longitude !== undefined &&
            item.longitude !== ""
        )
        .map((item, key) => {
          return {
            id: key,
            lat: item.latitude,
            lng: item.longitude,
            image: item.imageUrl,
            name: item.title,
            address: item.address,
            rating: item.rating,
            description: item.description,
            detailLink:
              this.props.match?.url.replace("Results", "Details") +
              "/" +
              item.id +
              "/" +
              item.provider,
            // (item.config.find(x => x.key === "ActivityToken") !== undefined
            //   ? "|" + item.config.find(x => x.key === "ActivityToken").value
            //   : "")
            showPopup: false,
          };
        });
    else {
      if (
        data !== undefined &&
        data.locationInfo !== undefined &&
        data.locationInfo.fromLocation.latitude !== "" &&
        data.locationInfo.fromLocation.longitude !== ""
      ) {
        return [
          {
            id: data.id,
            lat: data.locationInfo.fromLocation.latitude,
            lng: data.locationInfo.fromLocation.longitude,
            image:
              data.url ||
              (data.images.find((x) => x.isDefault) !== undefined &&
                data.images.find((x) => x.isDefault).url) ||
              (ImageNotFoundHotel),
            name: data.name,
            address:
              data.locationInfo.fromLocation.address +
              (data.locationInfo.fromLocation.city !== ""
                ? " " + data.locationInfo.fromLocation.city
                : "") +
              (data.locationInfo.fromLocation.country !== ""
                ? " " + data.locationInfo.fromLocation.country
                : ""),
            rating: data.rating,
            description: data.description,
            detailLink:
              this.props.match.url.replace("Results", "Details") +
              "/" +
              data.id +
              "/" +
              data.vendors[0].item.provider +
              (data.config.find((x) => x.key === "ActivityToken") !== undefined
                ? "|" + data.config.find((x) => x.key === "ActivityToken").value
                : "|" + this.state.token) + "/false" + "/false",
            showPopup: false,
          },
        ];
      } else return [];
    }
  };

  getMapDataForListPage = (data) => {
    if (Array.isArray(data))
      return data
        .filter(
          (item) =>
            item.locationInfo.fromLocation.latitude !== undefined &&
            item.locationInfo.fromLocation.latitude !== "" &&
            item.locationInfo.fromLocation.longitude !== undefined &&
            item.locationInfo.fromLocation.longitude !== "" &&
            item.locationInfo.fromLocation.address !== undefined &&
            item.locationInfo.fromLocation.address !== ""
        )
        .map((item, key) => {
          return {
            id: key,
            lat: item.locationInfo.fromLocation.latitude,
            lng: item.locationInfo.fromLocation.longitude,
            image:
              item.url ||
              (item.images.find((x) => x.type === "default") !== undefined &&
                item.images.find((x) => x.type === "default").url) ||
              (ImageNotFoundHotel),
            name: item.name,
            address:
              item.locationInfo.fromLocation.address +
              (item.locationInfo.fromLocation.city !== ""
                ? " " + item.locationInfo.fromLocation.city
                : "") +
              (item.locationInfo.fromLocation.country !== ""
                ? " " + item.locationInfo.fromLocation.country
                : ""),
            rating: item.rating,
            description: item.description,
            detailLink:
              this.props.match.url.replace("Results", "Details") +
              "/" +
              item.id +
              "/" +
              item.vendors[0].item.provider +
              (item.config.find((x) => x.key === "ActivityToken") !== undefined
                ? "|" + item.config.find((x) => x.key === "ActivityToken").value
                : "|" + this.state.token) + "/false" + "/false",
            showPopup: false,
          };
        });
    else {
      if (
        data.locationInfo.fromLocation.latitude !== "" &&
        data.locationInfo.fromLocation.longitude !== "" &&
        data.locationInfo.fromLocation.latitude !== -1 &&
        data.locationInfo.fromLocation.longitude !== -1 &&
        data.locationInfo.fromLocation.address !== undefined &&
        data.locationInfo.fromLocation.address !== ""
      ) {
        return [
          {
            id: data.id,
            lat: data.locationInfo.fromLocation.latitude,
            lng: data.locationInfo.fromLocation.longitude,
            image:
              data.url ||
              (data.images.find((x) => x.isDefault) !== undefined &&
                data.images.find((x) => x.isDefault).url) ||
              (ImageNotFoundHotel),
            name: data.name,
            address:
              data.locationInfo.fromLocation.address +
              (data.locationInfo.fromLocation.city !== ""
                ? " " + data.locationInfo.fromLocation.city
                : "") +
              (data.locationInfo.fromLocation.country !== ""
                ? " " + data.locationInfo.fromLocation.country
                : ""),
            rating: data.rating,
            description: data.description,
            detailLink:
              this.props?.match?.url?.replace("Results", "Details") +
              "/" +
              data.id +
              "/" +
              data.vendors[0].item.provider +
              (data.config.find((x) => x.key === "ActivityToken") !== undefined
                ? "|" + data.config.find((x) => x.key === "ActivityToken").value
                : "|" + this.state.token) + "/false" + "/false",
            showPopup: false,
          },
        ];
      } else return [];
    }
  };

  getMapInfoWindowString = (item, businessName, infoWindowStyle) => {
    return (
      <MapPopupContainer
        item={item}
        businessName={businessName}
        infoWindowStyle={infoWindowStyle}
      />
    );
  };

  // Wish List
  addToWishList = (item) => {
    let wishList = this.state.wishList;

    item.business !== "air" &&
      item.business !== "vehicle" &&
      (wishList.find((e) => e.id === item.id)
        ? (wishList = wishList.filter((x) => x.id !== item.id))
        : wishList.push(item));

    (item.business === "air" || item.business === "vehicle") &&
      (wishList.find((e) => e.token === item.token)
        ? (wishList = wishList.filter((x) => x.token !== item.token))
        : wishList.push(item));

    this.setState({
      wishList,
    });
  };

  clearWishList = () => {
    this.setState({
      wishList: [],
    });
  };

  handleWishListPopup = () => {
    this.setState({
      wishListPopup: !this.state.wishListPopup,
    });
  };

  sendWishList = (req) => {
    let reqURL = "api/v1/wishlist/add";
    let reqOBJ = {
      Request: {
        token: this.state.token,
        data: req.data,
      },
      templateInfo: req.templateInfo,
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.handleWishListPopup();
        this.handleSuccessPopup();
      }.bind(this)
    );
  };

  handleSuccessPopup = () => {
    this.setState({
      isSuccessPopup: !this.state.isSuccessPopup,
    });
  };
}

export default ResultBase;
