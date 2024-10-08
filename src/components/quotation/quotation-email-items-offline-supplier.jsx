import React from "react";
import Date from "../../helpers/date";
import Amount from "../../helpers/amount";
import ImageHotelDefault from "../../assets/images/tourwiz/hotel-default.png";
import ImageActivityDefault from "../../assets/images/tourwiz/activity-default.png";
import ImageTransfersDefault from "../../assets/images/tourwiz/transfers-default.png";
import ImageCustomDefault from "../../assets/images/tourwiz/custom-default.png";
import SideArrow from "../../assets/images/arrow-right.svg";
import moment from "moment";
import HtmlParser from "../../helpers/html-parser";
const QuotationEmailItemsOfflineSupplier = (props) => {
  const getRequestInfo = (item, business) => {
    debugger;
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
  const item = props.item.offlineItem;
  const isHidePrice = props.isHidePrice;
  const ShowhideElementname = props.ShowhideElementname;
  const isfromPreview = props.isfromPreview;
  const selectedItemsforMail = props.selectedItemsforMail;
  const showImagesInEmail = props.showImagesInEmail;
  let selecteditemid = [];
  let flightDetailsForStops = props.item.offlineItem.business === "air" && getRequestInfo(props.item.offlineItem, props.item.offlineItem.business);
  let roomtype = item.hotelPaxInfo && item.hotelPaxInfo.length > 0 ? item.hotelPaxInfo.map(room => room.roomType ? room.roomType : "").reduce((prev, curr) => [prev, ' , ', curr]) : item.roomType ?? "";
  function handleChange(e) {
    let target = e.target;
    //if (!this.state.selectedItemsforMail.includes(target.value))
    // selecteditemidtarget.value);
    props.getselecteditems(target.value);

  }
  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>

      <tbody>
        {(item.business === "hotel" ||
          item.business === "activity" ||
          item.business === "transfers" ||
          item.business === "custom") && (
            <tr>
              <td>
                <table id={item.uuid} cellPadding="0" cellSpacing="0" border="0" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  paddingBottom: "16px",
                                  paddingTop: "24px",
                                }}
                              >
                                <h5
                                  style={{
                                    fontSize: "20px",
                                    color: "#f18247",
                                    fontWeight: "bold",
                                    padding: "0px",
                                    margin: "0px",
                                  }}
                                >
                                  {!isfromPreview &&
                                    <input
                                      type="checkbox"
                                      className=""
                                      style={{ marginRight: "10px" }}
                                      value={item.uuid}
                                      checked={item.Selected}
                                      onChange={(e) => { handleChange(e) }}
                                    />
                                  }
                                  {item.name}
                                  {item.business === "transfers" && (
                                    <React.Fragment>
                                      {item.fromLocation} To {item.toLocation}
                                    </React.Fragment>
                                  )}
                                </h5>
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td valign="top">
                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                          <tbody>
                            <tr>
                              <td valign="top">
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      {showImagesInEmail &&
                                        <td width="1%" style={{ width: "1%" }}>
                                          <span>
                                            {item.ImageUrl && (
                                              <img
                                                src={item.ImageUrl}
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src =
                                                    item.business === "hotel"
                                                      ? "https://www.tourwizonline.com/static/media/hotel-default.26dff6e6.png"
                                                      : item.business === "activity"
                                                        ? "https://www.tourwizonline.com/static/media/activity-default.36876291.png"
                                                        : item.business === "transfers"
                                                          ? "https://www.tourwizonline.com/static/media/transfers-default.fa36aeee.png"
                                                          : "https://www.tourwizonline.com/static/media/custom-default.258d57df.png"
                                                }}
                                                alt=""
                                                width="250px"
                                                height="160px"
                                                style={{
                                                  width: "250px",
                                                  height: "160px",
                                                  objectFit: "cover",
                                                }}
                                              ></img>
                                            )}

                                            {!item.ImageUrl && (
                                              <img
                                                src={
                                                  item.business === "hotel"
                                                    ? "https://www.tourwizonline.com/static/media/hotel-default.26dff6e6.png"
                                                    : item.business === "activity"
                                                      ? "https://www.tourwizonline.com/static/media/activity-default.36876291.png"
                                                      : item.business === "transfers"
                                                        ? "https://www.tourwizonline.com/static/media/transfers-default.fa36aeee.png"
                                                        : "https://www.tourwizonline.com/static/media/custom-default.258d57df.png"
                                                }
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src =
                                                    item.business === "hotel"
                                                      ? "https://www.tourwizonline.com/static/media/hotel-default.26dff6e6.png"
                                                      : item.business === "activity"
                                                        ? "https://www.tourwizonline.com/static/media/activity-default.36876291.png"
                                                        : item.business === "transfers"
                                                          ? "https://www.tourwizonline.com/static/media/transfers-default.fa36aeee.png"
                                                          : "https://www.tourwizonline.com/static/media/custom-default.258d57df.png"
                                                }}
                                                alt=""
                                                width="250px"
                                                height="160px"
                                                style={{
                                                  width: "250px",
                                                  height: "160px",
                                                  objectFit: "cover",
                                                }}
                                              ></img>
                                            )}
                                          </span>
                                        </td>
                                      }
                                      <td
                                        valign="top"
                                        style={{
                                          paddingLeft: "16px",
                                        }}
                                      >
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            {(item.business === "hotel" ||
                                              item.business === "activity" ||
                                              item.business === "custom") && (
                                                <tr>
                                                  <td
                                                    style={{
                                                      fontSize: "14px",
                                                      paddingBottom: "8px",
                                                    }}
                                                  >
                                                    <div>
                                                      <b>Address : </b>
                                                      {item.toLocation}
                                                    </div>

                                                  </td>
                                                </tr>
                                              )}

                                            {item.business === "transfers" && (
                                              <React.Fragment>
                                                <tr>
                                                  <td
                                                    style={{
                                                      fontSize: "14px",
                                                      paddingBottom: "8px",
                                                    }}
                                                  >
                                                    <div>
                                                      <b>Pick-up : </b>
                                                      {item.fromLocation}
                                                    </div>
                                                  </td>
                                                </tr>

                                                <tr>
                                                  <td
                                                    style={{
                                                      fontSize: "14px",
                                                      paddingBottom: "8px",
                                                    }}
                                                  >
                                                    <div>
                                                      <b>Drop-off : </b>
                                                      {item.toLocation}
                                                    </div>
                                                  </td>
                                                </tr>
                                              </React.Fragment>
                                            )}

                                            {item.business === "hotel" && (
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Star Rating : </b> {item.rating}
                                                    <span> Star</span>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}

                                            {item.business !== "custom" && (
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    {item.business === "hotel" && (
                                                      <React.Fragment>
                                                        <b>No of Room(s) : </b> {item.hotelPaxInfo && item.hotelPaxInfo.length > 0 ? item.hotelPaxInfo.length : item.noRooms}
                                                      </React.Fragment>
                                                    )}

                                                    {(item.business === "activity" ||
                                                      item.business === "transfers") && (
                                                        <React.Fragment>
                                                          <b>No of Guest(s) : </b>
                                                          {item.guests}
                                                        </React.Fragment>
                                                      )}
                                                  </div>
                                                </td>
                                              </tr>
                                            )}

                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  {item.business === "hotel" && roomtype && roomtype !== "" && (
                                                    <React.Fragment>
                                                      <b>Room Type(s) : </b>
                                                      {item.hotelPaxInfo && item.hotelPaxInfo.length > 0 ? item.hotelPaxInfo.map(room => room.roomType ? room.roomType : "").reduce((prev, curr) => [prev, ' , ', curr]) : item.roomType}
                                                    </React.Fragment>
                                                  )}

                                                  {(item.business === "activity" ||
                                                    item.business === "transfers" ||
                                                    item.business === "custom") && (
                                                      <React.Fragment>
                                                        <b>
                                                          {item.business === "activity" &&
                                                            "Activity Type : "}
                                                          {item.business === "transfers" &&
                                                            "Vehicle Type : "}
                                                          {item.business === "custom" && "Item Type : "}
                                                        </b>
                                                        {item.itemType}
                                                      </React.Fragment>
                                                    )}
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  {item.business === "hotel" && (
                                                    <React.Fragment>
                                                      {item.mealType && item.mealType !== "" &&
                                                        <React.Fragment><b>Meal : {item.mealType}</b></React.Fragment>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                            {item.day !== "All Days" && (item.business !== "custom") &&
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    {item.business === "hotel" && <b>Check-in : </b>}
                                                    {(item.business === "activity" ||
                                                      item.business === "transfers" ||
                                                      item.business === "custom") && <b>Date : </b>}
                                                    <Date date={item.startDate} />
                                                  </div>
                                                </td>
                                              </tr>
                                            }
                                            {(props?.type === "Quotation_Master") && item.day !== "All Days" && (item.business === "custom") &&
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    {(item.business === "custom") && <b>Date : </b>}
                                                    <Date date={item.startDate} />
                                                  </div>
                                                </td>
                                              </tr>
                                            }
                                            {item.day !== "All Days" && (item.business === "custom") &&
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >{((item.type === "Itinerary")
                                                  || ((item.type === "Quotation")
                                                    && item.business !== "custom")) &&
                                                  <div>
                                                    {item.business === "hotel" && <b>Check-in : </b>}
                                                    {(item.business === "activity" ||
                                                      item.business === "transfers" ||
                                                      item.business === "custom") && <b>Date : </b>}
                                                    <Date date={item.startDate} />
                                                  </div>}
                                                </td>
                                              </tr>
                                            }
                                            {(item.business === "custom") && (item.day === "All Days" || props.type === "Quotation") &&
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Date : </b>
                                                    <Date date={item.startDate} /> -{" "}
                                                    <Date date={item.endDate} />
                                                  </div>
                                                </td>
                                              </tr>
                                            }

                                            {(item.business === "activity" ||
                                              item.business === "transfers") && (
                                                <tr>
                                                  <td
                                                    style={{
                                                      fontSize: "14px",
                                                      paddingBottom: "8px",
                                                    }}
                                                  >
                                                    <div>
                                                      <b>
                                                        {item.business === "activity" && "Duration : "}
                                                        {item.business === "transfers" &&
                                                          "Pick-up Time : "}
                                                      </b>
                                                      <span>{item.pickupTime}</span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}

                                            {item.business === "hotel" && (
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Check-out : </b>
                                                    <Date date={item.endDate} />
                                                  </div>

                                                </td>
                                              </tr>
                                            )}

                                            {item.business === "custom" && item.description &&
                                              item.description.length < 180 && (
                                                <tr>
                                                  <td
                                                    style={{
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    <div>
                                                      <b>Description : </b>
                                                      {<HtmlParser text={item.description} />}
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}

                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            {item.description && item.business !== "custom" && (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  <br />
                                  <div>{<HtmlParser text={item.description} />}</div>
                                </td>
                              </tr>
                            )}

                            {item.description &&
                              item.description.length > 180 &&
                              item.business === "custom" && (
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    <br />
                                    <div>{<HtmlParser text={item.description} />}</div>
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}

        {(item.business || item.itemDtl.business) === "air" && (
          <tr>
            <td>
              <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                paddingTop: "24px",
                              }}
                            >
                              <h5
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              >
                                {!isfromPreview && !props.returnFlight && <input
                                  type="checkbox"
                                  className=""
                                  style={{ marginRight: "10px", marginBottom: "16px" }}
                                  value={item.uuid}
                                  checked={item.Selected}
                                  onChange={(e) => { handleChange(e) }}
                                />
                                }
                                {item.fromLocation}
                                {" - "}
                                {item.toLocation}
                                {item.isRoundTrip && " - "}
                                {item.isRoundTrip && item.fromLocation}
                              </h5>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {(props.type !== "ItineraryItem" ||
                                (props.departFlight && !props.returnFlight)) &&
                                ShowhideElementname === "showAllPrices" && (
                                  <h5
                                    style={{
                                      fontSize: "20px",
                                      color: "#f18247",
                                      fontWeight: "bold",
                                      padding: "0px",
                                      margin: "0px",
                                    }}
                                  >

                                  </h5>
                                )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    {showImagesInEmail &&
                      <td>
                        <img
                          src={
                            item.business === "hotel"
                              ? "https://www.tourwizonline.com/static/media/hotel-default.26dff6e6.png"
                              : item.business === "activity"
                                ? "https://www.tourwizonline.com/static/media/activity-default.36876291.png"
                                : item.business === "transfers"
                                  ? "https://www.tourwizonline.com/static/media/transfers-default.fa36aeee.png"
                                  : "https://www.tourwizonline.com/static/media/custom-default.258d57df.png"
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              item.business === "hotel"
                                ? "https://www.tourwizonline.com/static/media/hotel-default.26dff6e6.png"
                                : item.business === "activity"
                                  ? "https://www.tourwizonline.com/static/media/activity-default.36876291.png"
                                  : item.business === "transfers"
                                    ? "https://www.tourwizonline.com/static/media/transfers-default.fa36aeee.png"
                                    : "https://www.tourwizonline.com/static/media/custom-default.258d57df.png"
                          }}
                          alt=""
                          width="250px"
                          height="160px"
                          style={{
                            width: "250px",
                            height: "160px",
                            objectFit: "cover",
                          }}
                        ></img>
                      </td>
                    }
                    <td style={{ paddingLeft: "16px" }}>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          {(props.type !== "ItineraryItem" ||
                            (props.departFlight && !props.returnFlight)) && (
                              <tr>
                                <td
                                  style={{
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "16px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <b>{item.fromLocation}- </b>
                                                  <b>{item.toLocation}</b>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td width="99%">
                                                  <table
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    border="0"
                                                    width="100%"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Airline: </b>
                                                            {item.departAirlineName}
                                                          </span>{" "}
                                                          <span>{item.departFlightNumber}</span>,{" "}
                                                          <span>
                                                            <b>Stop(s): </b>
                                                            {Array.isArray(item.departStops) ? item.departStops.length : Number(item.departStops)} stop(s)
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Duration: </b>
                                                            {item.departDuration}
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Cabin Class: </b>
                                                            {item.departClass}
                                                          </span>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Departure: </b>
                                                            <Date
                                                              date={item.departStartDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.departStartTime}
                                                            <b>, Arrival: </b>
                                                            <Date
                                                              date={item.departEndDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.departEndTime}
                                                          </span>

                                                          <span>
                                                            {item.adult && (
                                                              <React.Fragment>
                                                                , <b>{item.adult}</b> Adult(s)
                                                              </React.Fragment>
                                                            )}
                                                            {item.child && Number(item.child) > 0 && (
                                                              <React.Fragment>
                                                                , <b>{item.child}</b> Child(ren)
                                                              </React.Fragment>
                                                            )}
                                                            {item.infant && Number(item.infant) > 0 && (
                                                              <React.Fragment>
                                                                , <b>{item.infant}</b> Infant(s)
                                                              </React.Fragment>
                                                            )}
                                                          </span>
                                                          <br />
                                                          <br />
                                                          {item.departStops.length > 0 && flightDetailsForStops[0]?.ManualItem?.items[0]?.item.map((x, index) => {
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
                                                                  {<Date
                                                                    date={x.dateInfo.startDate.split('T')[0]}
                                                                    format="shortDate"
                                                                  />}{" " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                                                </span>
                                                                <b>Arrival: </b>
                                                                <span> {<Date
                                                                  date={x.dateInfo.endDate.split('T')[0]}
                                                                  format="shortDate"
                                                                />}{" " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                                                <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                                                <br />
                                                                {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                                                  && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                                                {x.tpExtension[0].value !== "" &&
                                                                  <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span>
                                                                    <br /></>}
                                                                <br />
                                                                {item?.departStops[index]?.layOverTime !== undefined &&
                                                                  <><b>Layover Time : {item?.departStops[index]?.layOverTime === undefined ? "" : item?.departStops[index]?.layOverTime}</b>
                                                                    <br />
                                                                  </>}
                                                                <br />
                                                              </React.Fragment>)
                                                          })}
                                                          {item.description &&
                                                            <span>
                                                              <b>, Description:</b> {<HtmlParser text={item.description} />}
                                                            </span>}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>

                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}

                          {(props.type !== "ItineraryItem" ||
                            (!props.departFlight && props.returnFlight)) &&
                            item.isRoundTrip && (

                              <tr>
                                <td
                                  style={{
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "16px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <b>{item.toLocation}- </b>
                                                  <b>{item.fromLocation}</b>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td width="99%">
                                                  <table
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    border="0"
                                                    width="100%"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Airline: </b>
                                                            {item.returnAirlineName}
                                                          </span>{" "}
                                                          <span>{item.returnFlightNumber}</span>,{" "}
                                                          <span>
                                                            <b>Stop(s): </b>
                                                            {Array.isArray(item.returnStops) ? item.returnStops.length : Number(item.returnStops)} stop(s)
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Duration: </b>
                                                            {item.returnDuration}
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Cabin Class: </b>
                                                            {item.returnClass}
                                                          </span>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Departure: </b>
                                                            <Date
                                                              date={item.returnStartDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.returnStartTime}
                                                            <b>, Arrival: </b>
                                                            <Date
                                                              date={item.returnEndDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.returnEndTime}
                                                          </span>

                                                          <span>
                                                            {item.adult && (
                                                              <React.Fragment>
                                                                , <b>{item.adult}</b> Adult(s)
                                                              </React.Fragment>
                                                            )}
                                                            {item.child && Number(item.child) > 0 && (
                                                              <React.Fragment>
                                                                , <b>{item.child}</b> Child(ren)
                                                              </React.Fragment>
                                                            )}
                                                            {item.infant && Number(item.infant) > 0 && (
                                                              <React.Fragment>
                                                                , <b>{item.infant}</b> Infant(s)
                                                              </React.Fragment>
                                                            )}
                                                          </span>
                                                          <br />
                                                          <br />
                                                          {item.returnStops.length > 0 && flightDetailsForStops[0]?.ManualItem?.items[1]?.item.map((x, index) => {
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
                                                                  {<Date
                                                                    date={x.dateInfo.startDate.split('T')[0]}
                                                                    format="shortDate"
                                                                  />}{" " + x.dateInfo.startDate.split('T')[1].slice(0, 5) + ", "}
                                                                </span>
                                                                <b>Arrival: </b>
                                                                <span> {<Date
                                                                  date={x.dateInfo.endDate.split('T')[0]}
                                                                  format="shortDate"
                                                                />}{" " + x.dateInfo.endDate.split('T')[1].slice(0, 5) + ", "}</span>
                                                                <b>Duration: {x.tpExtension[1].value + "h" + " " + x.tpExtension[2].value + "m"}</b>
                                                                <br />
                                                                {(x?.vendors[0]?.item?.name !== undefined && x?.vendors[0]?.item?.name !== "")
                                                                  && <><b>Airline:  </b><span>{x?.vendors[0]?.item?.name + "   "}{x.Code + ", "}</span></>}
                                                                {x.tpExtension[0].value !== "" &&
                                                                  <><b>Cabin Class: </b><span> {x.tpExtension[0].value}</span><br /></>}
                                                                <br />
                                                                {item?.returnStops[index]?.layOverTime !== undefined &&
                                                                  <><b>Layover Time : {item?.returnStops[index]?.layOverTime === undefined ? "" : item?.returnStops[index]?.layOverTime}</b>
                                                                    <br />
                                                                  </>}
                                                                <br />
                                                              </React.Fragment>)
                                                          })}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}

                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default QuotationEmailItemsOfflineSupplier;
