import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import StarRating from "./../common/star-rating";
import Date from "../../helpers/date";
import DateComp from "../../helpers/date";
import { decode } from "html-entities";
import * as Global from "../../helpers/global";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import QuotationDetailsPopup from "./quotation-details-popup";
import HtmlParser from "../../helpers/html-parser";
import ImageHotelDefault from "../../assets/images/tourwiz/hotel-default.png";
import ImageActivityDefault from "../../assets/images/tourwiz/activity-default.png";
import ImageTransfersDefault from "../../assets/images/tourwiz/transfers-default.png";
import ImageCustomDefault from "../../assets/images/tourwiz/custom-default.png";
import loadingImage from "../../assets/images/ac_loading.gif";
import SideArrow from "../../assets/images/arrow-right.svg";
import moment from "moment";

class QuotationItineraryDetailsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailPopup: false,
      activeTab: "photos",
      isShowFlightStop: false,
      isShowStopDetails: {}
    };
  }

  showHideDetailPopup = (activeTab) => {
    this.setState({ isDetailPopup: !this.state.isDetailPopup, activeTab });
  };
  showFlightStop = (stop) => {
    let isShowStopDetails = this.state.isShowStopDetails;
    if (stop === "returnStops") {
      isShowStopDetails.return = !isShowStopDetails.return;
    }
    if (stop === "departStops") {
      isShowStopDetails.depart = !isShowStopDetails.depart;
    }
    this.setState({ isShowStopDetails });
  }
  componentDidMount() {
    this.setDepartData();
  }


  setDepartData = () => {
    let myObject = {};
    myObject.depart = false;
    if (this.props.item.offlineItem.isRoundTrip) {
      myObject.return = false;
    }
    this.setState({ isShowStopDetails: myObject })
  }
  getRequestInfo = (item, business) => {
    item.departStops = (Array.isArray(item.departStops)
      ? item.departStops
      : [...Array(Number(item.departStops)).keys()])
      .map(item => {
        if (Object.keys(item).length < 2)
          return false
        else return item;
      }).filter(Boolean);
    item.returnStops = (Array.isArray(item.returnStops)
      ? item.returnStops
      : [...Array(Number(item.returnStops)).keys()])
      .map(item => {
        if (Object.keys(item).length < 2)
          return false
        else return item;
      }).filter(Boolean);
    if (!item.isRoundTrip) {
      return [
        {
          ManualItem: {
            business: item.business,
            objectIdentifier: "flightOption",
            TripType: "oneway",
            Amount: item.sellPrice !== "" ? item.sellPrice : 0,
            totalDuration:
              item.departDuration !== ""
                ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                : "0",
            TicketTimeLimit:
              moment(item.departEndDate).format("YYYY-MM-DD") +
              "T" +
              (item.departEndTime !== ""
                ? item.departEndTime + ":00"
                : "00:00:00"),
            Description: item.Description,
            LocationInfo: {
              FromLocation: {
                ID: item.fromLocation || "Unnamed",
                Name: item.fromLocationName || "Unnamed",
                CountryID: item.fromLocation || "Unnamed",
                Country: item.fromLocationCity || "Unnamed",
                City: item.fromLocationCity || "Unnamed",
                Type: "Location",
              },
              ToLocation: {
                ID: item.toLocation || "Unnamed",
                Name: item.toLocationName || "Unnamed",
                CountryID: item.toLocation || "Unnamed",
                Country: item.toLocationCity || "Unnamed",
                City: item.toLocationCity || "Unnamed",
                Type: "Location",
              },
            },
            dateInfo: {
              startDate:
                moment(item.departStartDate).format("YYYY-MM-DD") +
                "T" +
                (item.departStartTime !== ""
                  ? item.departStartTime + ":00"
                  : "00:00:00"),
              endDate:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
            },
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.adult !== "" ? parseInt(item.adult) : 1,
                type: 0,
              },
              {
                typeString: "CHD",
                quantity: item.child !== "" ? parseInt(item.child) : 0,
                type: 1,
              },
              {
                typeString: "INF",
                quantity: item.infant !== "" ? parseInt(item.infant) : 0,
                type: 2,
              },
            ],
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            StopDetails: [item.departStops !== ""
              ? Array.isArray(item.departStops)
                ? item.departStops.length
                : item.departStops
              : 0],
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
                  startDate:
                    moment(item.departStartDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.departStartTime !== ""
                      ? item.departStartTime + ":00"
                      : "00:00:00"),
                  endDate:
                    moment(item.departEndDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.departEndTime !== ""
                      ? item.departEndTime + ":00"
                      : "00:00:00"),
                },
                LocationInfo: {
                  FromLocation: {
                    ID: item.fromLocation || "Unnamed",
                    Name: item.fromLocationName || "Unnamed",
                    CountryID: item.fromLocation || "Unnamed",
                    Country: item.fromLocationCity || "Unnamed",
                    City: item.fromLocationCity || "Unnamed",
                    Type: "Location",
                  },
                  ToLocation: {
                    ID: item.toLocation || "Unnamed",
                    Name: item.toLocationName || "Unnamed",
                    CountryID: item.toLocation || "Unnamed",
                    Country: item.toLocationCity || "Unnamed",
                    City: item.toLocationCity || "Unnamed",
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
                    journeyDuration: item.totaldepartDuration,
                    vendors: [
                      {
                        type: "airline",
                        item: {
                          code: "6E",
                          name: item.departAirlineName,
                        },
                      },
                      {
                        type: "operatingAirline",
                        item: {
                          code: "6E",
                          name: item.departAirlineName,
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
                              item.departDuration
                                .split(" ")[0]
                                .replace("h", "")
                            )
                            : "0",
                      },
                      {
                        key: "durationMinutes",
                        value:
                          item.departDuration !== ""
                            ? parseInt(
                              item.departDuration
                                .split(" ")[1]
                                .replace("m", "")
                            )
                            : "0",
                      },
                    ],
                    LocationInfo: {
                      FromLocation: {
                        ID: item.fromLocation || "Unnamed",
                        Name: item.fromLocation || "Unnamed",
                        CountryID: item.fromLocation || "Unnamed",
                        Country: item.fromLocationCity || "Unnamed",
                        City: item.fromLocationCity || "Unnamed",
                        Type: "Location",
                      },
                      ToLocation: {
                        ID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        Name: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        CountryID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        Country: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                        City: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                        Type: "Location",
                      },
                    },
                    dateInfo: {
                      startDate:
                        moment(item.departStartDate).format("YYYY-MM-DD") +
                        "T" +
                        (item.departStartTime !== ""
                          ? item.departStartTime + ":00"
                          : "00:00:00"),
                      endDate:
                        (moment(Array.isArray(item.departStops) && item.departStops.length > 0
                          ? item.departStops[0].endDate
                          : item.departEndDate).format("YYYY-MM-DD")) +
                        "T" +
                        (Array.isArray(item.departStops) && item.departStops.length > 0
                          ? (item.departStops[0].departEndTime === "" ? "00:00" : item.departStops[0].departEndTime) + ":00"
                          : (item.departEndTime !== ""
                            ? item.departEndTime + ":00"
                            : "00:00:00")),
                    },
                  },
                  Array.isArray(item.departStops) && item.departStops.map((flightItem, index, array) => {
                    let toLocation = "";
                    if (array.length === 1) {
                      toLocation = item.toLocation;
                    }
                    else if (array.length > index + 1) {
                      toLocation = array[index + 1].stopLocation;
                    }
                    else
                      toLocation = item.toLocation;
                    return {
                      journeyDuration: flightItem.totaldepartDuration ?? 0,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                      ],
                      images: [
                        {
                          URL: flightItem.departImg ?? "",
                          Type: "default",
                          IsDefault: true,
                        },
                      ],
                      Code: flightItem.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: flightItem.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            flightItem.departDurationH !== ""
                              ? parseInt(
                                flightItem.departDurationH
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            flightItem.departDurationM !== ""
                              ? parseInt(
                                flightItem.departDurationM
                              )
                              : "0",
                        },
                      ],
                      "LocationInfo": {
                        "FromLocation": {
                          "ID": flightItem.stopLocation || "Unnamed",
                          "Name": flightItem.stopLocation || "Unnamed",
                          "CountryID": flightItem.fromLocation || "Unnamed",
                          "Country": flightItem.fromLocationCity || "Unnamed",
                          "City": flightItem.fromLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                        "ToLocation": {
                          "ID": toLocation || "Unnamed",
                          "Name": toLocation || "Unnamed",
                          "CountryID": toLocation || "Unnamed",
                          "Country": flightItem.toLocationCity || "Unnamed",
                          "City": flightItem.toLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                      },
                      "dateInfo": {
                        startDate:
                          moment(flightItem.startDate).format("YYYY-MM-DD") +
                          "T" +
                          (flightItem.departStartTime !== ""
                            ? flightItem.departStartTime + ":00"
                            : "00:00:00"),
                        endDate:
                          (moment(item.departStops.length - 1 === index
                            ? item.departEndDate
                            : item.departStops[0].endDate).format("YYYY-MM-DD"))
                          + "T" +
                          (item.departStops.length - 1 === index
                            ? (item.departEndTime !== ""
                              ? item.departEndTime + ":00"
                              : "00:00:00")
                            : (item.departStops[index + 1].departEndTime === ''
                              ? '00:00'
                              : item.departStops[index + 1].departEndTime) + ":00"
                          ),
                      },
                    }
                  }),
                ].filter(Boolean).flatMap((x) => x),
              },
            ],
          },
        },
      ];

    } else {
      return [
        {
          ManualItem: {
            business: item.business,
            Amount: item.sellPrice !== "" ? item.sellPrice : 0,
            totalDuration:
              item.departDuration !== ""
                ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                : "0",
            LocationInfo: {
              FromLocation: {
                ID: item.fromLocation || "Unnamed",
                Name: item.fromLocation || "Unnamed",
                CountryID: item.fromLocation || "Unnamed",
                Country: item.fromLocationCity || "Unnamed",
                City: item.fromLocationCity || "Unnamed",
                Type: "Location",
              },
              ToLocation: {
                ID: item.toLocation || "Unnamed",
                Name: item.toLocation || "Unnamed",
                CountryID: item.toLocation || "Unnamed",
                Country: item.toLocationCity || "Unnamed",
                City: item.toLocationCity || "Unnamed",
                Type: "Location",
              },
            },
            dateInfo: {
              startDate:
                moment(item.departStartDate).format("YYYY-MM-DD") +
                "T" +
                (item.departStartTime !== ""
                  ? item.departStartTime + ":00"
                  : "00:00:00"),
              endDate:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
            },
            StopDetails: [
              item.departStops !== ""
                ? Array.isArray(item.departStops)
                  ? item.departStops.length
                  : item.departStops
                : 0,
              item.returnStops !== ""
                ? Array.isArray(item.returnStops)
                  ? item.returnStops.length
                  : item.returnStops
                : 0,
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
                  startDate:
                    moment(item.departStartDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.departStartTime !== ""
                      ? item.departStartTime + ":00"
                      : "00:00:00"),
                  endDate:
                    moment(item.departEndDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.departEndTime !== ""
                      ? item.departEndTime + ":00"
                      : "00:00:00"),
                },
                LocationInfo: {
                  FromLocation: {
                    ID: item.fromLocation || "Unnamed",
                    Name: item.fromLocation || "Unnamed",
                    CountryID: item.fromLocation || "Unnamed",
                    Country: item.fromLocationCity || "Unnamed",
                    City: item.fromLocationCity || "Unnamed",
                    Type: "Location",
                  },
                  ToLocation: {
                    ID: item.toLocation || "Unnamed",
                    Name: item.toLocation || "Unnamed",
                    CountryID: item.toLocation || "Unnamed",
                    Country: item.toLocationCity || "Unnamed",
                    City: item.toLocationCity || "Unnamed",
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
                    journeyDuration: item.totaldepartDuration,
                    vendors: [
                      {
                        type: "airline",
                        item: {
                          code: "6E",
                          name: item.departAirlineName,
                        },
                      },
                      {
                        type: "operatingAirline",
                        item: {
                          code: "6E",
                          name: item.departAirlineName,
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
                              item.departDuration
                                .split(" ")[0]
                                .replace("h", "")
                            )
                            : "0",
                      },
                      {
                        key: "durationMinutes",
                        value:
                          item.departDuration !== ""
                            ? parseInt(
                              item.departDuration
                                .split(" ")[1]
                                .replace("m", "")
                            )
                            : "0",
                      },
                    ],
                    LocationInfo: {
                      FromLocation: {
                        ID: item.fromLocation || "Unnamed",
                        Name: item.fromLocation || "Unnamed",
                        CountryID: item.fromLocation || "Unnamed",
                        Country: item.fromLocationCity || "Unnamed",
                        City: item.fromLocationCity || "Unnamed",
                        Type: "Location",
                      },
                      ToLocation: {
                        ID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        Name: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        CountryID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                        Country: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                        City: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                        Type: "Location",
                      },
                    },
                    dateInfo: {
                      startDate:
                        moment(item.departStartDate).format("YYYY-MM-DD") +
                        "T" +
                        (item.departStartTime !== ""
                          ? item.departStartTime + ":00"
                          : "00:00:00"),
                      endDate:
                        (moment(Array.isArray(item.departStops) && item.departStops.length > 0
                          ? item.departStops[0].endDate
                          : item.departEndDate).format("YYYY-MM-DD")) +
                        "T" +
                        (Array.isArray(item.departStops) && item.departStops.length > 0
                          ? (item.departStops[0].departEndTime === '' ? '00:00' : item.departStops[0].departEndTime) + ":00"
                          : (item.departEndTime !== ""
                            ? item.departEndTime + ":00"
                            : "00:00:00")),
                    },
                  },
                  Array.isArray(item.departStops) && item.departStops.map((flightItem, index, array) => {
                    let toLocation = "";
                    if (array.length === 1) {
                      toLocation = item.toLocation;
                    }
                    else if (array.length > index + 1) {
                      toLocation = array[index + 1].stopLocation;
                    }
                    else
                      toLocation = item.toLocation;
                    return {
                      journeyDuration: flightItem.totaldepartDuration ?? 0,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                      ],
                      images: [
                        {
                          URL: flightItem.departImg ?? "",
                          Type: "default",
                          IsDefault: true,
                        },
                      ],
                      Code: flightItem.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: flightItem.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            flightItem.departDurationH !== ""
                              ? parseInt(
                                flightItem.departDurationH
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            flightItem.departDurationM !== ""
                              ? parseInt(
                                flightItem.departDurationM
                              )
                              : "0",
                        },
                      ],
                      "LocationInfo": {
                        "FromLocation": {
                          "ID": flightItem.stopLocation || "Unnamed",
                          "Name": flightItem.stopLocation || "Unnamed",
                          "CountryID": flightItem.fromLocation || "Unnamed",
                          "Country": flightItem.fromLocationCity || "Unnamed",
                          "City": flightItem.fromLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                        "ToLocation": {
                          "ID": toLocation || "Unnamed",
                          "Name": toLocation || "Unnamed",
                          "CountryID": toLocation || "Unnamed",
                          "Country": flightItem.toLocationCity || "Unnamed",
                          "City": flightItem.toLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                      },
                      "dateInfo": {
                        startDate:
                          moment(flightItem.startDate).format("YYYY-MM-DD") +
                          "T" +
                          (flightItem.departStartTime !== ""
                            ? flightItem.departStartTime + ":00"
                            : "00:00:00"),
                        endDate:
                          (moment(item.departStops.length - 1 === index
                            ? item.departEndDate
                            : item.departStops[0].endDate).format("YYYY-MM-DD"))
                          + "T" +
                          (item.departStops.length - 1 === index
                            ? (item.departEndTime !== ""
                              ? item.departEndTime + ":00"
                              : "00:00:00")
                            : (item.departStops[index + 1].departEndTime === '' ? '00:00' : item.departStops[index + 1].departEndTime) + ":00"
                          ),
                      },
                    }
                  }),
                ].filter(Boolean).flatMap((x) => x),
              },
              {
                totalDuration:
                  item.returnDuration !== ""
                    ? parseInt(
                      item.returnDuration.split(" ")[0].replace("h", "")
                    )
                    : "0",
                dateInfo: {
                  startDate:
                    moment(item.returnStartDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.returnStartTime !== ""
                      ? item.returnStartTime + ":00"
                      : "00:00:00"),
                  endDate:
                    moment(item.returnEndDate).format("YYYY-MM-DD") +
                    "T" +
                    (item.returnEndTime !== ""
                      ? item.returnEndTime + ":00"
                      : "00:00:00"),
                },
                LocationInfo: {
                  FromLocation: {
                    ID: item.toLocation || "Unnamed",
                    Name: item.toLocation || "Unnamed",
                    CountryID: item.toLocation || "Unnamed",
                    Country: item.toLocationCity || "Unnamed",
                    City: item.toLocationCity || "Unnamed",
                    Type: "Location",
                  },
                  ToLocation: {
                    ID: item.fromLocation || "Unnamed",
                    Name: item.fromLocation || "Unnamed",
                    CountryID: item.fromLocation || "Unnamed",
                    Country: item.fromLocationCity || "Unnamed",
                    City: item.fromLocationCity || "Unnamed",
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
                    journeyDuration: item.totalreturnDuration,
                    vendors: [
                      {
                        type: "airline",
                        item: {
                          code: "6E",
                          name: item.returnAirlineName,
                        },
                      },
                      {
                        type: "operatingAirline",
                        item: {
                          code: "6E",
                          name: item.returnAirlineName,
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
                              item.returnDuration
                                .split(" ")[0]
                                .replace("h", "")
                            )
                            : "0",
                      },
                      {
                        key: "durationMinutes",
                        value:
                          item.returnDuration !== ""
                            ? parseInt(
                              item.returnDuration
                                .split(" ")[1]
                                .replace("m", "")
                            )
                            : "0",
                      },
                    ],
                    "LocationInfo": {
                      "FromLocation": {
                        "ID": item.toLocation || "Unnamed",
                        "Name": item.toLocation || "Unnamed",
                        "CountryID": item.toLocation || "Unnamed",
                        "Country": item.toLocationCity || "Unnamed",
                        "City": item.toLocationCity || "Unnamed",
                        "Type": "Location",
                      },
                      "ToLocation": {
                        "ID": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                        "Name": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                        "CountryID": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                        "Country": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? "" : item.fromLocationCity) || "Unnamed",
                        "City": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? "" : item.fromLocationCity) || "Unnamed",
                        "Type": "Location",
                      },
                    },

                    "dateInfo": {
                      "startDate":
                        moment(item.returnStartDate).format("YYYY-MM-DD") +
                        "T" +
                        (item.returnStartTime !== ""
                          ? item.returnStartTime + ":00"
                          : "00:00:00"),
                      "endDate":
                        moment(Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].endDate : item.returnEndDate).format("YYYY-MM-DD") +
                        "T" +
                        (Array.isArray(item.returnStops) && item.returnStops.length > 0
                          ? (item.returnStops[0].departEndTime === '' ? '00:00' : item.returnStops[0].departEndTime) + ":00"
                          : (item.returnEndTime !== ""
                            ? item.returnEndTime + ":00"
                            : "00:00:00")),
                    },
                  },
                  Array.isArray(item.returnStops) && item.returnStops.map((flightItem, index, array) => {
                    let toLocation = "";
                    if (array.length === 1) {
                      toLocation = item.fromLocation;
                    }
                    else if (array.length > index + 1) {
                      toLocation = array[index + 1].stopLocation;
                    }
                    else
                      toLocation = item.fromLocation;
                    return {
                      journeyDuration: flightItem.totalreturnDuration ?? 0,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: flightItem.departAirlineName,
                          },
                        },
                      ],
                      images: [
                        {
                          URL: flightItem.departImg ?? "",
                          Type: "default",
                          IsDefault: true,
                        },
                      ],
                      Code: flightItem.departFlightNumber,
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: flightItem.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            flightItem.departDurationH !== ""
                              ? parseInt(
                                flightItem.departDurationH
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            flightItem.departDurationM !== ""
                              ? parseInt(
                                flightItem.departDurationM
                              )
                              : "0",
                        },
                      ],
                      "LocationInfo": {
                        "FromLocation": {
                          "ID": flightItem.stopLocation || "Unnamed",
                          "Name": flightItem.stopLocation || "Unnamed",
                          "CountryID": flightItem.fromLocation || "Unnamed",
                          "Country": flightItem.fromLocationCity || "Unnamed",
                          "City": flightItem.fromLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                        "ToLocation": {
                          "ID": toLocation || "Unnamed",
                          "Name": toLocation || "Unnamed",
                          "CountryID": toLocation || "Unnamed",
                          "Country": flightItem.toLocationCity || "Unnamed",
                          "City": flightItem.toLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                      },
                      "dateInfo": {
                        startDate:
                          moment(flightItem.startDate).format("YYYY-MM-DD") +
                          "T" +
                          (flightItem.departStartTime !== ""
                            ? flightItem.departStartTime + ":00"
                            : "00:00:00"),
                        endDate:
                          (moment(item.returnStops.length - 1 === index
                            ? item.returnEndDate
                            : item.returnStops[0].endDate).format("YYYY-MM-DD"))
                          + "T" +
                          (item.returnStops.length - 1 === index
                            ? (item.returnEndTime !== ""
                              ? item.returnEndTime + ":00"
                              : "00:00:00")
                            : (item.returnStops[index + 1].departEndTime === '' ? '00:00' : item.returnStops[index + 1].departEndTime) + ":00"
                          ),
                      },
                    }
                  }),
                ].filter(Boolean).flatMap((x) => x),
              },
            ],
          },
        },
      ];
    }
  };
  getImageCall = (business, uuid, imgUrl) => {
    let defaultImg = business === "hotel"
      ? ImageHotelDefault
      : business === "activity"
        ? ImageActivityDefault
        : business === "transfers"
          ? ImageTransfersDefault
          : ImageCustomDefault;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        var data = reader.result;
        if (data.startsWith("data:application/problem+json;base64")) {
          document.getElementById(uuid).src = defaultImg;
          document.getElementById(uuid).style["object-fit"] = "cover";
        }
        else {
          data = atob(data.replace("data:text/plain;base64,", ""));
          document.getElementById(uuid).src = data;
          document.getElementById(uuid).style["object-fit"] = "cover";
        }
      }.bind(this);
      reader.readAsDataURL(xhr.response);
    }.bind(this);
    xhr.open('GET', process.env.REACT_APP_IMAGEHANDLER_ENDPOINT + "/image?isbase64ImageString=true&url=" + imgUrl);
    xhr.responseType = 'blob';
    xhr.send();
    return loadingImage;
  }

  render() {
    const { item, showImagesInPreview, type, proposalInfo } = this.props;
    const { activeTab } = this.state;
    let roomtype = item.offlineItem.hotelPaxInfo && item.offlineItem.hotelPaxInfo.length > 0 ? item.offlineItem.hotelPaxInfo.map(room => room.roomType ? room.roomType : item.offlineItem.roomType).reduce((prev, curr) => [prev, ', ', curr]) : "";
    let flightDetailsForStops = item.offlineItem.business === "air" && this.getRequestInfo(item.offlineItem, item.offlineItem.business);
    return (
      <div className="border-bottom p-3 quotation-details-item dayview-item">
        <React.Fragment>
          {item.offlineItem && (
            <div className="row">
              {this.state.isDetailPopup && (
                <QuotationDetailsPopup
                  details={item.offlineItem.details}
                  businessName={item.offlineItem.business}
                  hideQuickBook={this.showHideDetailPopup}
                  activeTab={activeTab}
                />
              )}

              {(item.offlineItem.business === "hotel" ||
                item.offlineItem.business === "activity" ||
                item.offlineItem.business === "transfers" ||
                item.offlineItem.business === "custom") && (
                  <React.Fragment>
                    <div className="quotation-details-item-col col-lg-10 d-flex">
                      <div className="d-flex itinerary-landing-page-items">
                        {this?.props?.isRemovePriceAndActionButton &&
                          <div className="position-relative itinerary-landing-page-img">
                            {showImagesInPreview &&
                              <img
                                id={item.offlineItem.uuid}
                                style={{
                                  height: "280px",
                                  width: "420px",
                                  objectFit: "none",
                                }}
                                src={
                                  item.offlineItem.ImageUrl
                                    ? this.getImageCall(item.offlineItem.business, item.offlineItem.uuid, item.offlineItem.ImageUrl)
                                    : item.offlineItem.business === "hotel"
                                      ? ImageHotelDefault
                                      : item.offlineItem.business === "activity"
                                        ? ImageActivityDefault
                                        : item.offlineItem.business === "transfers"
                                          ? ImageTransfersDefault
                                          : ImageCustomDefault
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    item.offlineItem.business === "hotel"
                                      ? ImageHotelDefault
                                      : item.offlineItem.business === "activity"
                                        ? ImageActivityDefault
                                        : item.offlineItem.business === "transfers"
                                          ? ImageTransfersDefault
                                          : ImageCustomDefault
                                }}
                                alt=""
                              />}
                            {/* {item.offlineItem.details && (
                            <button data-html2canvas-ignore
                              className="btn btn-primary"
                              style={{
                                position: "absolute",
                                right: "16px",
                                bottom: "16px",
                                margin: "auto auto",
                                opacity: "0.9",
                              }}
                              onClick={() => this.showHideDetailPopup(item.offlineItem.imgUrl ? "photos" : "overview")}
                            >
                              <SVGIcon
                                name="search"
                                width="16"
                                type="fill"
                                height="16"
                              ></SVGIcon>
                            </button>
                          )} */}
                          </div>}

                        <div className="quotation-details-item-title ml-4">
                          {item.offlineItem.details && (
                            <h2 className="p-0 m-0 mb-1"
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                              onClick={() => this.showHideDetailPopup("")}
                            >
                              {item.offlineItem.name}

                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem.rating > 0 && (
                                <span
                                  className="ml-3 position-relative"
                                  style={{ top: "-2px" }}
                                >
                                  <StarRating
                                    {...[parseInt(item.offlineItem.rating)]}
                                  />
                                </span>
                              )}
                            </h2>
                          )}

                          {!item.offlineItem.details && (
                            <h2
                              className="p-0 m-0 mb-1"
                              style={{ fontSize: "1.5rem", fontWeight: "600" }}
                            >
                              {item.offlineItem.name}

                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem.rating > 0 && (
                                <span
                                  className="ml-3 position-relative"
                                  style={{ top: "-2px" }}
                                >
                                  <StarRating
                                    {...[parseInt(item.offlineItem.rating)]}
                                  />
                                </span>
                              )}
                            </h2>
                          )}

                          {item.offlineItem.business === "transfers" && (
                            <h2
                              className="p-0 m-0 mb-1"
                              style={{ fontSize: "1.2rem", fontWeight: "600" }}
                            >
                              {item.offlineItem.fromLocation}
                              {item.offlineItem.toLocation &&
                                " To " + item.offlineItem.toLocation}
                            </h2>
                          )}

                          {this?.props?.isRemovePriceAndActionButton &&
                            item.offlineItem.business === "hotel" &&
                            item.offlineItem.toLocation && (
                              <small className="mt-1 mr-3 text-secondary">
                                <SVGIcon
                                  name="map-marker"
                                  width="16"
                                  type="fill"
                                  height="16"
                                  className="mr-2"
                                ></SVGIcon>
                                {item.offlineItem.toLocation}
                              </small>
                            )}

                          {(item.offlineItem.business === "activity") &&
                            item.offlineItem.duration && (
                              <small className="text-secondary">
                                <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                {Trans("_duration")} : {item.offlineItem.duration}
                              </small>
                            )}

                          {item.offlineItem.business === "transfers" &&
                            item.offlineItem.pickupTime && (
                              <small className="text-secondary">
                                <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                {"Pick-up Time"} : {item.offlineItem.pickupTime}
                              </small>
                            )}

                          {item.offlineItem.business === "custom" &&
                            item.offlineItem.description &&
                            item.offlineItem.description.length < 180 && (
                              <small className="mt-1 mr-3 text-secondary">
                                <SVGIcon
                                  name="file-text"
                                  width="16"
                                  height="16"
                                  className="mr-2"
                                ></SVGIcon>
                                {<HtmlParser text={item.offlineItem.description} />}
                              </small>
                            )}

                          <div className="mt-3">
                            <div>
                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem.business === "hotel" &&
                                <React.Fragment>
                                  {item.offlineItem.hotelPaxInfo && item.offlineItem.hotelPaxInfo.length > 0 ?
                                    <React.Fragment>
                                      <b>No of Room(s) : {item.offlineItem.hotelPaxInfo.length ? item.offlineItem.hotelPaxInfo.length : item.offlineItem.noRooms}

                                      </b>
                                    </React.Fragment>
                                    : item.offlineItem.noRooms &&
                                    <b>{item.offlineItem.noRooms} x Room(s) : </b>
                                  }
                                </React.Fragment>
                              }

                              {(item.offlineItem.business === "activity" ||
                                item.offlineItem.business === "transfers") &&
                                item.offlineItem.guests && (
                                  <b>{item.offlineItem.guests} x Guest(s) : </b>
                                )}
                              {item.offlineItem.business !== "hotel" && item.offlineItem.itemType}
                            </div>

                            <div>
                              {this?.props?.isRemovePriceAndActionButton && roomtype && roomtype !== "" &&
                                <React.Fragment>
                                  <b>Room Type(s) : {item.offlineItem.hotelPaxInfo.map(room => room.roomType ? room.roomType : item.offlineItem.roomType).reduce((prev, curr) => [prev, ', ', curr])}
                                  </b>
                                </React.Fragment>
                              }
                            </div>
                            <div>
                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem.mealType && item.offlineItem.mealType !== "" &&
                                <React.Fragment>
                                  <b>Meal : {item.offlineItem.mealType}</b>
                                </React.Fragment>
                              }
                            </div>
                            <div>
                              {this?.props?.isRemovePriceAndActionButton &&
                                item.offlineItem.business === "hotel" && (
                                  <small className="text-secondary">
                                    {item.offlineItem.toLocationCity &&
                                      item.offlineItem.toLocationCity + " - "}
                                    <Date date={item.offlineItem.startDate} />
                                    {item.offlineItem.endDate && " to "}
                                    <Date date={item.offlineItem.endDate} />{" "}
                                    {item.offlineItem.nights !== 0 &&
                                      " - " + item.offlineItem.nights + " night(s)"}
                                  </small>
                                )}

                              {item.offlineItem.business === "activity" && (
                                <small className="text-secondary">
                                  {item.offlineItem.toLocation &&
                                    item.offlineItem.toLocation + " - "}
                                  <Date date={item.offlineItem.startDate} />
                                </small>
                              )}

                              {item.offlineItem.business === "custom" && item.offlineItem.day !== "All Days" && type === "Itinerary" && (
                                <small className="text-secondary mb-3 d-block">
                                  {item.offlineItem.toLocation &&
                                    item.offlineItem.toLocation + " - "}
                                  <Date date={item.offlineItem.startDate} />
                                </small>
                              )}

                              {item.offlineItem.business === "custom" && (item.offlineItem.day === "All Days" || type !== "Itinerary") && (
                                <small className="text-secondary">
                                  {item.offlineItem.toLocation && item.offlineItem.toLocation + " - "}
                                  <Date date={item.offlineItem.startDate} />
                                  {" - "}
                                  <Date date={item.offlineItem.endDate} />
                                </small>
                              )}

                              {item.offlineItem.business === "transfers" && (
                                <small className="text-secondary">
                                  {item.offlineItem.pickupType}
                                  {item.offlineItem.dropoffType &&
                                    " - " + item.offlineItem.dropoffType + " - "}
                                  <Date date={item.offlineItem.startDate} />
                                </small>
                              )}

                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem?.details?.description && (
                                <p
                                  className="mt-3 text-secondary"

                                >
                                  <HtmlParser
                                    text={item.offlineItem.details.description.length > 195 ? item.offlineItem.details.description.substr(0, 195) + "..." : item.offlineItem.details.description}
                                  />
                                </p>
                              )}

                              {this?.props?.isRemovePriceAndActionButton && item.offlineItem.details && (
                                <div data-html2canvas-ignore>
                                  <button
                                    className="btn btn-sm btn-outline-primary m-0"
                                    onClick={() => this.showHideDetailPopup("")}
                                  >
                                    More Details
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}

              {item.offlineItem.business === "air" && (
                <React.Fragment>
                  <div className="col-lg-10">
                    <div className="row">
                      {!this.props.departFlight && !this.props.returnFlight && (
                        <React.Fragment>
                          <div className="col-lg-12">
                            <div>
                              <div className="row">
                                <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
                                  <div
                                    className="quotation-details-item-icon border rounded bg-white d-flex align-items-center justify-content-center"
                                    style={{ height: "48px", width: "48px" }}
                                  >
                                    <SVGIcon
                                      className="d-flex align-items-center text-primary"
                                      name={item.offlineItem.business}
                                      width="32"
                                      type="fill"
                                    ></SVGIcon>
                                  </div>

                                  <div className="quotation-details-item-title ml-3">
                                    <img
                                      style={{ maxWidth: "60px" }}
                                      src={item.offlineItem.departImg}
                                      alt=""
                                    />

                                    <h2
                                      className="p-0 m-0 mb-1"
                                      style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <span className="text-nowrap mr-2">
                                        {item.offlineItem.departAirlineName}
                                      </span>
                                      <small className="text-secondary">
                                        {item.offlineItem.departFlightNumber}
                                      </small>
                                    </h2>
                                    <div data-html2canvas-ignore class="d-flex justify-content-right">
                                      {item?.offlineItem?.departStops?.length > 0 &&
                                        <button
                                          type="button"
                                          class="btn btn-link pull-right p-0 m-0 text-primary"
                                          onClick={() => this.showFlightStop("departStops")}>
                                          Stop Details
                                        </button>
                                      }
                                    </div>
                                  </div>
                                </div>

                                <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.fromLocation}
                                  </span>

                                  <b>{item.offlineItem.departStartTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                      date={item.offlineItem.departStartDate}
                                      format="shortDate"
                                    /> */}
                                    {DateComp({ date: item.offlineItem.departStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <span className="small text-nowrap mb-2">
                                    <i className="align-text-bottom">
                                      <SVGIcon
                                        name="clock"
                                        className="mr-1 text-secondary"
                                        width="12"
                                        height="12"
                                      ></SVGIcon>
                                    </i>
                                    {item.offlineItem.departDuration}
                                  </span>
                                  <Stops {...[item.offlineItem.departStops]} />
                                  <span className="small mt-1 text-nowrap">
                                    {(Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) === 0
                                      ? "non stop"
                                      : (Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) ===
                                        1
                                        ? "1 stop"
                                        : (Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) + " stops"}

                                    {item.offlineItem.departClass &&
                                      " | " + item.offlineItem.departClass}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.toLocation}
                                  </span>

                                  <b>{item.offlineItem.departEndTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                      date={item.offlineItem.departEndDate}
                                      format="shortDate"
                                    /> */}
                                    {DateComp({ date: item.offlineItem.departEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1"></div>
                          <div className="col-lg-11 mt-4">
                            {this.state.isShowStopDetails.depart && flightDetailsForStops[0]?.ManualItem?.items[0]?.item.map((x, index) => {
                              return (
                                <React.Fragment>
                                  <b>Stop {index + 1 + ": "}</b>
                                  <b>
                                    {x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x.LocationInfo.FromLocation.Name + " "}
                                    {(x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x?.LocationInfo?.ToLocation?.Name !== "Unnamed")
                                      && <img src={SideArrow} alt="SideArrow" />}
                                    {x?.LocationInfo?.ToLocation?.Name !== "Unnamed" && " " + x.LocationInfo.ToLocation.Name}
                                  </b>
                                  <br />
                                  <b>Departure: </b>
                                  <span>
                                    {DateComp({ date: x.dateInfo.startDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                      + " " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                  </span>
                                  <b>Arrival: </b>
                                  <span>{DateComp({ date: x.dateInfo.endDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                    + " " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                  <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                  <br />
                                  {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                    && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                  {x.tpExtension[0].value !== "" &&
                                    <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span><br /></>}
                                  <br />
                                  {item?.offlineItem?.departStops[index]?.layOverTime !== undefined &&
                                    <><b>Layover Time : {item?.offlineItem?.departStops[index]?.layOverTime === undefined
                                      ? "" : item?.offlineItem?.departStops[index]?.layOverTime}</b>
                                      <br />
                                    </>}
                                  <br />
                                </React.Fragment>)
                            })}
                          </div>

                          {item.offlineItem.isRoundTrip &&
                            <React.Fragment>
                              <div className="col-lg-12">
                                <div className="mt-3">
                                  <div className="row">
                                    <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
                                      <div
                                        className="border rounded bg-white d-flex align-items-center justify-content-center"
                                        style={{ height: "48px", width: "48px" }}
                                      >
                                        <SVGIcon
                                          className="d-flex align-items-center text-primary"
                                          name={item.offlineItem.business}
                                          width="32"
                                          type="fill"
                                        ></SVGIcon>
                                      </div>

                                      <div className="quotation-details-item-title ml-3">
                                        <img
                                          style={{
                                            maxWidth: "60px",
                                            maxHeight: "28px",
                                          }}
                                          src={item.offlineItem.returnImg}
                                          alt=""
                                        />
                                        <h2
                                          className="p-0 m-0 mb-1"
                                          style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "600",
                                          }}
                                        >
                                          <span className="text-nowrap mr-2">
                                            {item.offlineItem.returnAirlineName}
                                          </span>
                                          <small className="text-secondary">
                                            {item.offlineItem.returnFlightNumber}
                                          </small>
                                        </h2>
                                        <div data-html2canvas-ignore class="d-flex justify-content-right">
                                          {item?.offlineItem?.returnStops?.length > 0 &&
                                            <button type="button" class="btn btn-link pull-right p-0 m-0 text-primary"
                                              onClick={() => this.showFlightStop("returnStops")}>Stop Details</button>}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                      <span className="small text-secondary">
                                        {item.offlineItem.toLocation}
                                      </span>

                                      <b>{item.offlineItem.returnStartTime}</b>

                                      <span className="small text-secondary">
                                        {/* <Date
                                        date={item.offlineItem.returnStartDate}
                                        format="shortDate"
                                      /> */}
                                        {DateComp({ date: item.offlineItem.returnStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                      </span>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                      <span className="small text-nowrap mb-2">
                                        <i className="align-text-bottom">
                                          <SVGIcon
                                            name="clock"
                                            className="mr-1 text-secondary"
                                            width="12"
                                            height="12"
                                          ></SVGIcon>
                                        </i>
                                        {item.offlineItem.returnDuration}
                                      </span>
                                      <Stops
                                        {...[item.offlineItem.returnStops]}
                                      />
                                      <span className="small mt-1 ">
                                        {(Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) ===
                                          0
                                          ? "non stop"
                                          : (Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) === 1
                                            ? "1 stop"
                                            : (Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) +
                                            " stops"}

                                        {item.offlineItem.returnClass &&
                                          " | " + item.offlineItem.returnClass}
                                      </span>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                      <span className="small text-secondary">
                                        {item.offlineItem.fromLocation}
                                      </span>

                                      <b>{item.offlineItem.returnEndTime}</b>

                                      <span className="small text-secondary">
                                        {/* <Date
                                        date={item.offlineItem.returnEndDate}
                                        format="shortDate"
                                      /> */}
                                        {DateComp({ date: item.offlineItem.returnEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-1"></div>
                              <div className="col-lg-11 mt-4">
                                {this.state.isShowStopDetails.return && flightDetailsForStops[0]?.ManualItem?.items[1]?.item.map((x, index) => {
                                  return (
                                    <React.Fragment>
                                      <b>Stop {index + 1 + ": "}</b>
                                      <b>
                                        {x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x.LocationInfo.FromLocation.Name + " "}
                                        {(x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x?.LocationInfo?.ToLocation?.Name !== "Unnamed")
                                          && <img src={SideArrow} alt="SideArrow" />}
                                        {x?.LocationInfo?.ToLocation?.Name !== "Unnamed" && " " + x.LocationInfo.ToLocation.Name}
                                      </b>
                                      <br />
                                      <b>Departure: </b>
                                      <span>
                                        {DateComp({ date: x.dateInfo.startDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                          + " " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                      </span>
                                      <b>Arrival: </b>
                                      <span>{DateComp({ date: x.dateInfo.endDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                        + " " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                      <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                      <br />
                                      {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                        && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                      {x.tpExtension[0].value !== "" &&
                                        <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span><br /></>}
                                      <br />
                                      {item?.offlineItem?.returnStops[index]?.layOverTime !== undefined &&
                                        <><b>Layover Time : {item?.offlineItem?.returnStops[index]?.layOverTime === undefined
                                          ? "" : item?.offlineItem?.returnStops[index]?.layOverTime}</b>
                                          <br />
                                        </>}
                                      <br />
                                    </React.Fragment>)
                                })
                                }
                              </div>
                            </React.Fragment>
                          }
                        </React.Fragment>
                      )}

                      {this.props.departFlight && !this.props.returnFlight && (
                        <React.Fragment>
                          <div className="col-lg-12">
                            <div>
                              <div className="row">
                                <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
                                  <div
                                    className="quotation-details-item-icon border rounded bg-white d-flex align-items-center justify-content-center"
                                    style={{ height: "48px", width: "48px" }}
                                  >
                                    <SVGIcon
                                      className="d-flex align-items-center text-primary"
                                      name={item.offlineItem.business}
                                      width="32"
                                      type="fill"
                                    ></SVGIcon>
                                  </div>

                                  <div className="quotation-details-item-title ml-3">
                                    <img
                                      style={{ maxWidth: "60px" }}
                                      src={item.offlineItem.departImg}
                                      alt=""
                                    />

                                    <h2
                                      className="p-0 m-0 mb-1"
                                      style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <span className="text-nowrap mr-2">
                                        {item.offlineItem.departAirlineName}
                                      </span>
                                      <small className="text-secondary">
                                        {item.offlineItem.departFlightNumber}
                                      </small>
                                    </h2>
                                    <div data-html2canvas-ignore class="d-flex justify-content-right">
                                      {item?.offlineItem?.departStops?.length > 0 &&
                                        <button type="button" class="btn btn-link pull-right p-0 m-0 text-primary"
                                          onClick={() => this.showFlightStop("departStops")}>Stop Details</button>}
                                    </div>
                                  </div>
                                </div>

                                <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.fromLocation}
                                  </span>

                                  <b>{item.offlineItem.departStartTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                    date={item.offlineItem.departStartDate}
                                    format="shortDate"
                                  /> */}
                                    {DateComp({ date: item.offlineItem.departStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <span className="small text-nowrap mb-2">
                                    <i className="align-text-bottom">
                                      <SVGIcon
                                        name="clock"
                                        className="mr-1 text-secondary"
                                        width="12"
                                        height="12"
                                      ></SVGIcon>
                                    </i>
                                    {item.offlineItem.departDuration}
                                  </span>
                                  <Stops {...[item.offlineItem.departStops]} />
                                  <span className="small mt-1 ">
                                    {(Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) === 0
                                      ? "non stop"
                                      : (Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) === 1
                                        ? (Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) + " stop"
                                        : (Array.isArray(item.offlineItem.departStops) ? item.offlineItem.departStops.length : Number(item.offlineItem.departStops)) + " stops"}
                                    {item.offlineItem.departClass &&
                                      " | " + item.offlineItem.departClass}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.toLocation}
                                  </span>

                                  <b>{item.offlineItem.departEndTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                    date={item.offlineItem.departEndDate}
                                    format="shortDate"
                                  /> */}
                                    {DateComp({ date: item.offlineItem.departEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1"></div>
                          <div className="col-lg-11 mt-4">
                            {this.state.isShowStopDetails.depart && flightDetailsForStops[0]?.ManualItem?.items[0]?.item.map((x, index) => {
                              return (
                                <React.Fragment>
                                  <b>Stop {index + 1 + ": "}</b>
                                  <b>
                                    {x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x.LocationInfo.FromLocation.Name + " "}
                                    {(x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x?.LocationInfo?.ToLocation?.Name !== "Unnamed")
                                      && <img src={SideArrow} alt="SideArrow" />}
                                    {x?.LocationInfo?.ToLocation?.Name !== "Unnamed" && " " + x.LocationInfo.ToLocation.Name}
                                  </b>
                                  <br />
                                  <b>Departure: </b>
                                  <span>
                                    {DateComp({ date: x.dateInfo.startDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                      + " " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                  </span>
                                  <b>Arrival: </b>
                                  <span>{DateComp({ date: x.dateInfo.endDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                    + " " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                  <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                  <br />
                                  {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                    && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                  {x.tpExtension[0].value !== "" &&
                                    <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span>
                                      <br /></>}
                                  <br />

                                  {item?.offlineItem?.departStops[index]?.layOverTime !== undefined &&
                                    <><b>Layover Time : {item?.offlineItem?.departStops[index]?.layOverTime === undefined
                                      ? "" : item?.offlineItem?.departStops[index]?.layOverTime}</b>
                                      <br />
                                    </>}
                                  <br />
                                </React.Fragment>)
                            })}
                          </div>
                        </React.Fragment>

                      )}

                      {!this.props.departFlight && this.props.returnFlight && (
                        <React.Fragment>
                          <div className="col-lg-12">
                            <div>
                              <div className="row">
                                <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
                                  <div
                                    className="border rounded bg-white d-flex align-items-center justify-content-center"
                                    style={{ height: "48px", width: "48px" }}
                                  >
                                    <SVGIcon
                                      className="d-flex align-items-center text-primary"
                                      name={item.offlineItem.business}
                                      width="32"
                                      type="fill"
                                    ></SVGIcon>
                                  </div>

                                  <div className="quotation-details-item-title ml-3">
                                    <img
                                      style={{
                                        maxWidth: "60px",
                                        maxHeight: "28px",
                                      }}
                                      src={item.offlineItem.returnImg}
                                      alt=""
                                    />
                                    <h2
                                      className="p-0 m-0 mb-1"
                                      style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <span className="text-nowrap mr-2">
                                        {item.offlineItem.returnAirlineName}
                                      </span>
                                      <small className="text-secondary">
                                        {item.offlineItem.returnFlightNumber}
                                      </small>
                                    </h2>
                                    <div data-html2canvas-ignore class="d-flex justify-content-right">
                                      {item?.offlineItem?.returnStops?.length > 0 &&
                                        <button type="button" class="btn btn-link pull-right p-0 m-0 text-primary"
                                          onClick={() => this.showFlightStop("returnStops")}>Stop Details</button>}
                                    </div>
                                  </div>
                                </div>

                                <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.toLocation}
                                  </span>

                                  <b>{item.offlineItem.returnStartTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                    date={item.offlineItem.returnStartDate}
                                    format="shortDate"
                                  /> */}
                                    {DateComp({ date: item.offlineItem.returnStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <span className="small text-nowrap mb-2">
                                    <i className="align-text-bottom">
                                      <SVGIcon
                                        name="clock"
                                        className="mr-1 text-secondary"
                                        width="12"
                                        height="12"
                                      ></SVGIcon>
                                    </i>
                                    {item.offlineItem.returnDuration}
                                  </span>
                                  <Stops {...[item.offlineItem.returnStops]} />
                                  <span className="small mt-1 ">
                                    {(Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) === 0
                                      ? "non stop"
                                      : (Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) === 1
                                        ? (Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) + " stop"
                                        : (Array.isArray(item.offlineItem.returnStops) ? item.offlineItem.returnStops.length : Number(item.offlineItem.returnStops)) + " stops"}

                                    {item.offlineItem.returnClass &&
                                      " | " + item.offlineItem.returnClass}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.fromLocation}
                                  </span>

                                  <b>{item.offlineItem.returnEndTime}</b>

                                  <span className="small text-secondary">
                                    {/* <Date
                                    date={item.offlineItem.returnEndDate}
                                    format="shortDate"
                                  /> */}
                                    {DateComp({ date: item.offlineItem.returnEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1"></div>
                          <div className="col-lg-11 mt-4">
                            {this.state.isShowStopDetails.return && flightDetailsForStops[0]?.ManualItem?.items[1]?.item.map((x, index) => {
                              return (
                                <React.Fragment>
                                  <b>Stop {index + 1 + ": "}</b>
                                  <b>
                                    {x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x.LocationInfo.FromLocation.Name + " "}
                                    {(x?.LocationInfo?.FromLocation?.Name !== "Unnamed" && x?.LocationInfo?.ToLocation?.Name !== "Unnamed")
                                      && <img src={SideArrow} alt="SideArrow" />}
                                    {x?.LocationInfo?.ToLocation?.Name !== "Unnamed" && " " + x.LocationInfo.ToLocation.Name}
                                  </b>
                                  <br />
                                  <b>Departure: </b>
                                  <span>
                                    {DateComp({ date: x.dateInfo.startDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                      + " " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                  </span>
                                  <b>Arrival: </b>
                                  <span>{DateComp({ date: x.dateInfo.endDate.split('T')[0], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })
                                    + " " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                  <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                  <br />
                                  {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                    && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                  {x.tpExtension[0].value !== "" &&
                                    <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span><br /></>}
                                  <br />
                                  {item?.offlineItem?.returnStops[index]?.layOverTime !== undefined &&
                                    <><b>Layover Time : {item?.offlineItem?.returnStops[index]?.layOverTime === undefined
                                      ? "" : item?.offlineItem?.returnStops[index]?.layOverTime}</b>
                                      <br />
                                    </>}
                                  <br />
                                </React.Fragment>)
                            })}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )}
              {proposalInfo?.isQuickProposal && (
                <React.Fragment>
                  <div className="col-lg-12">
                    <span>
                      <span>
                        I'm excited to present you with a quick travel proposal for your inquiry:
                        <br />
                      </span>
                      <br />
                      Proposal Name: {proposalInfo.name}
                      <br />
                      {item.offlineItem.sellPrice > 0 &&
                        <>
                          Sell Price: <Amount amount={Number(item.offlineItem.totalAmount) > 0 ? Number(item.offlineItem.totalAmount) : Number(item.offlineItem.sellPrice)}></Amount>
                          <br />
                          <br />
                        </>}
                      Description:<HtmlParser
                        text={decode(proposalInfo.quickproposalcomments)}
                      />
                    </span>
                  </div>

                </React.Fragment>
              )}
              {(item.offlineItem.business !== "air" ||
                (this.props.departFlight && !this.props.returnFlight) ||
                (!this.props.departFlight && !this.props.returnFlight)) &&
                this.props.isRemovePriceAndActionButton && (
                  <div className="quotation-details-item-col quotation-details-item-col-price col-lg-12 d-flex justify-content-end">
                    {this.props.isIndividualPrice && (
                      <h3
                        className="p-0 m-0 text-primary popup-toggle text-right"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "700",
                        }}
                      >
                        {!proposalInfo?.isQuickProposal &&
                          <Amount amount={Number(item.offlineItem.totalAmount) > 0 ? Number(item.offlineItem.totalAmount) : Number(item.offlineItem.sellPrice)}></Amount>
                        }
                        <small
                          className="d-block text-secondary mt-2"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {item?.offlineItem?.adult > 0 &&
                            parseInt(item.offlineItem.adult) + " Adult(s)"}
                          {item?.offlineItem?.child > 0 &&
                            ", " + parseInt(item.offlineItem.child) + " Child(ren)"}
                          {item?.offlineItem?.infant > 0 &&
                            ", " + parseInt(item.offlineItem.infant) + " Infant(s)"}
                        </small>
                      </h3>
                    )}
                  </div>
                )}

              {this?.props?.isRemovePriceAndActionButton &&
                item.offlineItem.description &&
                item.offlineItem.business !== "custom" && (
                  <div
                    className={
                      (item.offlineItem.description.length > 180
                        ? "col-lg-12"
                        : "col-lg-6") + " text-secondary mt-2"
                    }
                  >
                    <small style={{ whiteSpace: "pre-wrap" }}>
                      {<HtmlParser text={item.offlineItem.description} />}
                    </small>
                  </div>
                )}

              {item.offlineItem.description &&
                item.offlineItem.business === "custom" &&
                item.offlineItem.description.length > 180 && (
                  <div
                    className="col-lg-12 text-secondary mt-2"
                  >
                    <small style={{ whiteSpace: "pre-wrap" }}>
                      {<HtmlParser text={item.offlineItem.description} />}
                    </small>
                  </div>
                )}
            </div>
          )}
        </React.Fragment>
      </div>

    );
  }
}

export default QuotationItineraryDetailsItem;
