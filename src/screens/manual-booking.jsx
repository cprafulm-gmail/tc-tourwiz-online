import React, { Component } from "react";
import ManualBookingAddOffline from "../components/quotation/manual-booking-add-offline";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester } from "../services/requester";
import moment from "moment";
import ManualBookingSearchTabs from "../components/search/manual-booking-search-tabs";

class ManualBooking extends Component {
  state = { type: "Quotation", business: "hotel" };

  handleOffline = (item) => {
    this.addItem({ offlineItem: item });
  };

  addItem = (item) => {
    //const quotationItems = JSON.parse(localStorage.getItem("quotationItems"));
    //let items = quotationItems ? quotationItems : [];
    let items = [];
    item.offlineItem && items.push(item);
    this.setState({
      items,
    });
    localStorage.setItem("manualBookingItems", JSON.stringify(items));

    this.bookQuotationManually();
  };

  bookQuotationManually = () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };

    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.response);
      this.bookQuotationItemsManually(data.response);
    });
  };

  bookQuotationItemsManually = (manualCartId) => {

    let item = JSON.parse(localStorage.getItem("manualBookingItems"));
    item = item[0].offlineItem
    let reqURL = "api/v1/cart/add";

    let reqOBJ = {
      Request: {
        CartID: manualCartId,
        Data: this.getRequestInfo(item, item.business)
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      this.props.history.push(`/QuickBookCart`);
    });
  };

  getbrnconfig = (item) => {
    if (item.brn !== "") {
      return [
        {
          key: "BRN",
          value: item.brn.trim(),
        },
        {
          key: "SellPrice",
          value: item.sellPrice !== "" ? item.sellPrice : "1",
        },
      ]
    }
    else {
      return [
        {
          key: "SellPrice",
          value: item.sellPrice !== "" ? item.sellPrice : "1",
        },
      ]
    }
  };

  getRequestInfo = (item, business) => {
    if (business === "hotel") {
      return [
        {
          ManualItem: {
            business: item.business,
            Name: item.name !== "" ? item.name : "Unnamed Hotel",
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            CurrencyRefCode: "USD",
            LocationInfo: {
              FromLocation: {
                ID: item.details?.locationInfo?.fromLocation.countryID || "Unnamed",
                City: item.toLocation !== "" ? item.toLocation : "Unnamed",
                Name: item.toLocationCity !== "" ? item.toLocationCity : "Unnamed",
                CountryID:
                  item.details?.locationInfo?.fromLocation.countryID || "Unnamed",
                Type: "Location",
                Priority: 1,
              },
            },
            objectIdentifier: item.business,
            Rating: item.rating,
            RatingType: "Star",
            dateInfo: {
              startDate: moment(item.startDate),
              endDate: moment(item.endDate),
            },
            paxInfo: [
              {
                typeString: "ADT",
                quantity: 2,
                type: 0,
              },
            ],
            config: this.getbrnconfig(item),
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            items: [
              {
                item: [
                  {
                    name: item.itemType[0] || "Unnamed Room",
                    business: item.business,
                    objectIdentifier: "room",
                  },
                ],
              },
            ],
          },
        },
      ]
    }
    else if (business === "air") {
      if (!item.isRoundTrip) {
        return [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "oneway",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: "USD",
              totalDuration: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
              TicketTimeLimit: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocation || "Unnamed",
                  CountryID:
                    item.fromLocation || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocation || "Unnamed",
                  CountryID:
                    item.toLocation || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate: moment(item.departStartDate).format("YYYY-MM-DD") + "T" + (item.departStartTime !== "" ? item.departStartTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                endDate: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult,
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
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: "ManualAirBookingProvider",
                  },
                },
              ],
              StopDetails: [
                item.departStops !== "" ? item.departStops : 0
              ],
              tpExtension: [
                {
                  key: "durationHours",
                  value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                },
                {
                  key: "durationMinutes",
                  value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                }
              ],
              items:
                [
                  {
                    totalDuration: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                    dateInfo: {
                      startDate: moment(item.departStartDate).format("YYYY-MM-DD") + "T" + (item.departStartTime !== "" ? item.departStartTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                      endDate: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                    },
                    LocationInfo: {
                      FromLocation: {
                        ID: item.fromLocation || "Unnamed",
                        Name: item.fromLocation || "Unnamed",
                        CountryID:
                          item.fromLocation || "Unnamed",
                        Type: "Location",
                      },
                      ToLocation: {
                        ID: item.toLocation || "Unnamed",
                        Name: item.toLocation || "Unnamed",
                        CountryID:
                          item.toLocation || "Unnamed",
                        Type: "Location",
                      },
                    },
                    tpExtension: [
                      {
                        key: "durationHours",
                        value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                      },
                      {
                        key: "durationMinutes",
                        value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                      }
                    ],
                    item: [
                      {
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: item.departAirlineName
                            }
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: item.departAirlineName
                            }
                          }
                        ],
                        Code: item.departFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension:
                          [
                            {
                              key: "cabinClass",
                              value: item.departClass
                            },
                            {
                              key: "durationHours",
                              value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                            },
                            {
                              key: "durationMinutes",
                              value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                            }
                          ]
                      }
                    ]
                  }
                ]
            },
          },
        ]
      }
      else {
        return [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "roundtrip",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: "USD",
              totalDuration: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
              TicketTimeLimit: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocation || "Unnamed",
                  CountryID:
                    item.fromLocation || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocation || "Unnamed",
                  CountryID:
                    item.toLocation || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate: moment(item.departStartDate).format("YYYY-MM-DD") + "T" + (item.departStartTime !== "" ? item.departStartTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                endDate: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult,
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
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: "ManualAirBookingProvider",
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
                  value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                },
                {
                  key: "durationMinutes",
                  value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                }
              ],
              items:
                [
                  {
                    totalDuration: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                    dateInfo: {
                      startDate: moment(item.departStartDate).format("YYYY-MM-DD") + "T" + (item.departStartTime !== "" ? item.departStartTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                      endDate: moment(item.departEndDate).format("YYYY-MM-DD") + "T" + (item.departEndTime !== "" ? item.departEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                    },
                    LocationInfo: {
                      FromLocation: {
                        ID: item.fromLocation || "Unnamed",
                        Name: item.fromLocation || "Unnamed",
                        CountryID:
                          item.fromLocation || "Unnamed",
                        Type: "Location",
                      },
                      ToLocation: {
                        ID: item.toLocation || "Unnamed",
                        Name: item.toLocation || "Unnamed",
                        CountryID:
                          item.toLocation || "Unnamed",
                        Type: "Location",
                      },
                    },
                    tpExtension: [
                      {
                        key: "cabinClass",
                        value: item.departClass
                      },
                      {
                        key: "durationHours",
                        value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                      },
                      {
                        key: "durationMinutes",
                        value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                      }
                    ],
                    item: [
                      {
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: item.departAirlineName
                            }
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: item.departAirlineName
                            }
                          }
                        ],
                        Code: item.departFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension: [
                          {
                            key: "cabinClass",
                            value: item.departClass
                          },
                          {
                            key: "durationHours",
                            value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[0].replace("h", "")) : "0",
                          },
                          {
                            key: "durationMinutes",
                            value: item.departDuration !== "" ? parseInt(item.departDuration.split(" ")[1].replace("m", "")) : "0",
                          }
                        ]
                      }
                    ]
                  },
                  {
                    totalDuration: item.returnDuration !== "" ? parseInt(item.returnDuration.split(" ")[0].replace("h", "")) : "0",
                    dateInfo: {
                      startDate: moment(item.returnStartDate).format("YYYY-MM-DD") + "T" + (item.returnStartTime !== "" ? item.returnStartTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                      endDate: moment(item.returnEndDate).format("YYYY-MM-DD") + "T" + (item.returnEndTime !== "" ? item.returnEndTime.replace("h ", ":").replace("m", ":00") : "00:00:00"),
                    },
                    LocationInfo: {
                      FromLocation: {
                        ID: item.fromLocation || "Unnamed",
                        Name: item.fromLocation || "Unnamed",
                        CountryID:
                          item.fromLocation || "Unnamed",
                        Type: "Location",
                      },
                      ToLocation: {
                        ID: item.toLocation || "Unnamed",
                        Name: item.toLocation || "Unnamed",
                        CountryID:
                          item.toLocation || "Unnamed",
                        Type: "Location",
                      },
                    },
                    tpExtension: [
                      {
                        key: "cabinClass",
                        value: item.returnClass
                      },
                      {
                        key: "durationHours",
                        value: item.returnDuration !== "" ? parseInt(item.returnDuration.split(" ")[0].replace("h", "")) : "0",
                      },
                      {
                        key: "durationMinutes",
                        value: item.returnDuration !== "" ? parseInt(item.returnDuration.split(" ")[1].replace("m", "")) : "0",
                      }
                    ],
                    item: [
                      {
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: item.returnAirlineName
                            }
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: item.returnAirlineName
                            }
                          }
                        ],
                        Code: item.returnFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension: [
                          {
                            key: "cabinClass",
                            value: item.returnClass
                          },
                          {
                            key: "durationHours",
                            value: item.returnDuration !== "" ? parseInt(item.returnDuration.split(" ")[0].replace("h", "")) : "0",
                          },
                          {
                            key: "durationMinutes",
                            value: item.returnDuration !== "" ? parseInt(item.returnDuration.split(" ")[1].replace("m", "")) : "0",
                          }
                        ]
                      }
                    ]
                  },
                ]
            },
          },
        ]
      }
    }
    else if (business === "activity") {
      return [
        {
          ManualItem: {
            business: item.business,
            objectIdentifier: "activity",
            Name: item.name !== "" ? item.name : "Unnamed",
            Description: item.description,
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            dateInfo: {
              startDate: moment(item.startDate),
              endDate: moment(item.startDate)
            },
            TPExtension: [
              {
                Key: "duration",
                Value: item.duration
              }
            ],
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests !== "" ? item.guests : "2",
                type: 0
              }
            ],
            CurrencyRefCode: "USD",
            LocationInfo: {
              FromLocation: {
                ID: item.toLocation !== "" ? item.toLocation : "Unnamed",
                City: item.toLocation !== "" ? item.toLocation : "Unnamed",
                Name: item.toLocation !== "" ? item.toLocation : "Unnamed",
                CountryID: "AE",
                Type: "Location",
                Priority: 1
              }
            },
            vendors: [
              {
                item: {
                  name: "Activity Vendor"
                }
              }
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    name: item.itemType[0] !== "" ? item.itemType[0] : "Unnamed",
                    business: "activity",
                    objectIdentifier: "activityOption"
                  }
                ]
              }
            ]
          },
        },
      ]
    }
  };

  changeTab = (business) => {
    this.setState({ business });
    localStorage.setItem("manualBookingItems", []);
  };

  componentDidMount() {
    localStorage.setItem("manualBookingItems", []);
  }

  render() {
    const { business } = this.state;
    return (
      <div className="quotation">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon name="file-text" width="24" height="24" className="mr-3"></SVGIcon>
              Manual Booking
            </h1>
          </div>
        </div>
        <div className="container">
          <ManualBookingSearchTabs changeTab={this.changeTab} {...this.state} />

          <div className="border rounded shadow-sm mt-3">
            <ManualBookingAddOffline business={business} handleOffline={this.handleOffline} />
          </div>
        </div>
      </div>
    );
  }
}

export default ManualBooking;
