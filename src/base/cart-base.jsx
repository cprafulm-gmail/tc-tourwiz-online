import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import Config from "../config.json";
import moment from "moment";
import * as DropdownList from "../helpers/dropdown-list";
import * as Global from "../helpers/global";
import { parse, parsePhoneNumberFromString } from "libphonenumber-js";
import HotelSpecialRequest from "../components/cart/hotel-special-request";
import { Trans } from "../helpers/translate";
import ResultItemAirFareRule from "../components/results/result-item-air-fare-rule";
import HtmlParser from "../helpers/html-parser";
import Date from "../helpers/date";
import { Link } from "react-router-dom";
import Loader from "../components/common/loader";
import { apiRequester_quotation_api } from "../services/requester-quotation";

class CartBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  viewCart = () => {
    var reqURL = "api/v1/cart";
    var reqOBJ = {
      Request: localStorage.getItem("cartLocalId"),
      Flags: { lockcartifunlocked: true },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response !== undefined) {
          if (data.response.items.length === 0) {
            if (this.state.page === "cart-icon") {
              this.setState({
                isLoading: false,
                cart: null,
              });
            }
            if (this.state.page === "cart" || this.state.page === "payment" || this.state.page === "manualbookingcart")
              Global.getEnvironmetKeyValue("portalType") === "B2B" ||
                Global.getEnvironmetKeyValue("portalType") === "BOTH"
                ? (this.state.page === "manualbookingcart" ? this.props.history.push(`/`) : this.props.history.push(`/Search`))
                : window.location = "/"; //this.props.history.push(`/`);
          } else if (data.response.items.length > 0) {
            let defaultPaymentMode = Object.keys(
              data.response.paymentGatewayCharges
            )[0];
            let response = data.response;
            response.items = response.items.filter(x => x.isBookable);
            let PaperRateTimerRemainingMinutes;
            /* let myinterval = 0; */
            let paperratetimer;
            let ispaperrateitem = false;
            let difftimerinminute = 0;
            let seatTransactionToken = "";
            let airPaperRateId = 0;
            let PaperRateId = 0;
            let TotalSeats = 0;
            let IsInternational = false;
            if (response.items[0]?.data?.config.find(x => x.key === "isPaperRateItem") && response.items[0]?.data?.config.find(x => x.key === "PaperRateTimerRemainingMinutes")) {
              let datetimeofpaperrate = '2014-01-01 00:##minute##:##seconds##';
              difftimerinminute = parseInt(response.items[0]?.data?.config.find(x => x.key === "PaperRateTimerRemainingMinutes").value);
              datetimeofpaperrate = datetimeofpaperrate.replace('##minute##', Math.floor(difftimerinminute / 60));
              datetimeofpaperrate = datetimeofpaperrate.replace('##seconds##', difftimerinminute % 60);
              paperratetimer = new moment(datetimeofpaperrate);
              ispaperrateitem = true;
              seatTransactionToken = response.items[0]?.data?.config.find(x => x.key === "PaperRateSeatTransactionToken").value;
              airPaperRateId = response.items[0]?.data?.config.find(x => x.key === "AirPaperRateId").value;
              TotalSeats = response.items[0]?.data?.config.find(x => x.key === "TotalSeats").value;
              PaperRateId = response.items[0]?.data?.config.find(x => x.key === "PaperRateId").value;
              IsInternational = response.items[0]?.data?.config.find(x => x.key === "IsInternational").value === "true";
            }

            this.setState({
              cart: response,
              isLoading: false,
              isRemoveCartLoading: null,
              selectedPaymentMode: defaultPaymentMode,
              paperratetimer: paperratetimer,
              /* myInterval: (!ispaperrateitem || difftimerinminute === 0) ? 0 : window.setInterval(() => {
                this.timerForPaperRate();
              }, 1000), */
              isPaperRateBooking: ispaperrateitem,
              seatTransactionToken: seatTransactionToken,
              airPaperRateId: airPaperRateId,
              TotalSeats: TotalSeats,
              PaperRateId: PaperRateId,
              IsInternational: IsInternational,
              paperRateTotalTimeForExpire: difftimerinminute //in seconds 
            });
          }
        } else {
          if (this.state.page === "cart-icon") {
            this.setState({
              isLoading: false,
              cart: null,
            });
          }
        }
      }.bind(this)
    );
  };

  timerForPaperRate = async () => {
    if (this.state.cart !== undefined && this.state.cart !== null) {
      this.setState({ paperratetimer: this.state.paperratetimer.add(-1, 'seconds') });
      if (this.state.paperratetimer.minutes() === 0 && this.state.paperratetimer.seconds() === 0) {
        /* clearInterval(this.state.myInterval); */
        if (!this.state.isProceedToPaymentLoading) {
          //ToDo : call adapter endpoint for : release seats api
          await this.releasePaperRatesSeats();
        }
      }
    }
  }

  getPersonateDetails = () => {
    var reqURL = "api/v1/callcenter/getpersonatedetails";
    var reqOBJ = {
      Request: ""
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response !== undefined) {
          this.setState({
            personateDetails: data.response
          });
        } else {
          this.setState({
            personateDetails: null,
          });
        }
      }.bind(this)
    );
  };
  randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  CheckPaperRatesSeatAvailability = async () => {
    var reqURL =
      "paperrates/checkavailability?airpaperid=" + this.state.airPaperRateId +
      "&seats=" + this.state.TotalSeats +
      "&transactiontoken=" + this.state.seatTransactionToken;
    var reqOBJ = {};

    return new Promise(function (resolve, reject) {
      apiRequester_quotation_api(
        reqURL,
        reqOBJ,
        (datacheckavail) => {
          if (datacheckavail.response === "success") {
            resolve(true);
            //return true;
          } else {
            resolve(false);
            //return false;
          }

        },
        "GET"
      );
    });
  };

  ReleasePaperRatesSeats = async () => {
    var reqURL = "paperrates/release";
    var reqOBJ = {
      token: this.state.seatTransactionToken
    };

    return new Promise(function (resolve, reject) {
      apiRequester_quotation_api(
        reqURL,
        reqOBJ,
        (datareleaseseats) => {
          if (datareleaseseats.response === "success") {
            resolve(true);
            //return true;
          } else {
            resolve(false);
            //return false;
          }

        },
        "POST"
      );
    });
  };

  addTravellers = async (data) => {
    this.setState({
      isProceedToPaymentLoading: true,
    });
    if (this.state.isPaperRateBooking) {
      let isavailable = await this.CheckPaperRatesSeatAvailability();
      if (isavailable) {
        if (this.state.continueAsGuest) {
          const contact = data.find((x) => x.count === 0).data;
          const travellers = this.getTravellerData(contact, data);
          let reqURL = "api/v1/user/signup";
          let reqOBJ = this.getTravellersRequest(contact, travellers);
          let reqRegstration = {
            "request": {
              "profilePicture": null,
              "loginName": reqOBJ.contactDetails.FirstName + " " + reqOBJ.contactDetails.LastName,
              "firstName": reqOBJ.contactDetails.FirstName,
              "lastName": reqOBJ.contactDetails.LastName,
              "password": this.randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
              "location": {
                "countryID": reqOBJ.contactDetails.Location.countryID,
                "country": reqOBJ.contactDetails.Location.country
              },
              "contactInformation": {
                "name": reqOBJ.contactDetails.FirstName + " " + reqOBJ.contactDetails.LastName,
                "phoneNumber": reqOBJ.contactDetails.ContactInformation.phoneNumber,
                "phoneNumberCountryCode": reqOBJ.contactDetails.ContactInformation.phoneNumberCountryCode,
                "email": reqOBJ.contactDetails.LoginName
              },
              "genderDesc": reqOBJ.contactDetails.Gender === "M" ? "Male" : "Female",
              "gender": reqOBJ.contactDetails.Gender,
              "actlGender": reqOBJ.contactDetails.Gender === "M" ? "19" : "20"
            },
            "flags": { "isCustomerMode": true }
          }
          apiRequester(
            reqURL,
            reqRegstration,
            function (response) {
              if (response.status.code === 260029 || response.status.code === 260031) {
                //response.status.code === 260029      //response.status.code === 260031
                //User already exist                   //Phone number already taken
                response.response = response.status;
                response.continueAsGuest = this.state.continueAsGuest;
                this.props.handleLoginBox(response);
                this.setState({
                  isBtnLoading: false,
                  continueAsGuestMessage: ["Sorry, this email has been registered as a member, to continue please Login.", "Login password has been sent to the email address to the customer previously."]
                });
              }
              else
                this.addTravellersCall(data);
            }.bind(this));
        }
        else if (Global.getEnvironmetKeyValue("isCustomerSignupOnCartPage", "cobrand") &&
          (!sessionStorage.getItem("callCenterType")
            || sessionStorage.getItem("callCenterType") === ""
            || sessionStorage.getItem("callCenterType") === "undefined")) {
          this.addCustomer(data, this.setpersonate)
        }
        else {
          this.addTravellersCall(data);
        }
      }
      else {
        let cart = this.state.cart;
        cart.items[0].availabilityStatus = 5;
        this.setState({
          cart: cart
        });
      }
    }
    else {
      if (this.state.continueAsGuest) {
        const contact = data.find((x) => x.count === 0).data;
        const travellers = this.getTravellerData(contact, data);
        let reqURL = "api/v1/user/signup";
        let reqOBJ = this.getTravellersRequest(contact, travellers);
        let reqRegstration = {
          "request": {
            "profilePicture": null,
            "loginName": reqOBJ.contactDetails.FirstName + " " + reqOBJ.contactDetails.LastName,
            "firstName": reqOBJ.contactDetails.FirstName,
            "lastName": reqOBJ.contactDetails.LastName,
            "password": this.randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            "location": {
              "countryID": reqOBJ.contactDetails.Location.countryID,
              "country": reqOBJ.contactDetails.Location.country
            },
            "contactInformation": {
              "name": reqOBJ.contactDetails.FirstName + " " + reqOBJ.contactDetails.LastName,
              "phoneNumber": reqOBJ.contactDetails.ContactInformation.phoneNumber,
              "phoneNumberCountryCode": reqOBJ.contactDetails.ContactInformation.phoneNumberCountryCode,
              "email": reqOBJ.contactDetails.LoginName
            },
            "genderDesc": reqOBJ.contactDetails.Gender === "M" ? "Male" : "Female",
            "gender": reqOBJ.contactDetails.Gender,
            "actlGender": reqOBJ.contactDetails.Gender === "M" ? "19" : "20"
          },
          "flags": { "isCustomerMode": true }
        }
        apiRequester(
          reqURL,
          reqRegstration,
          function (response) {
            if (response.status.code === 260029 || response.status.code === 260031) {
              //response.status.code === 260029      //response.status.code === 260031
              //User already exist                   //Phone number already taken
              response.response = response.status;
              response.continueAsGuest = this.state.continueAsGuest;
              this.props.handleLoginBox(response);
              this.setState({
                isBtnLoading: false,
                continueAsGuestMessage: ["Sorry, this email has been registered as a member, to continue please Login.", "Login password has been sent to the email address to the customer previously."]
              });
            }
            else
              this.addTravellersCall(data);
          }.bind(this));
      }
      else if (Global.getEnvironmetKeyValue("isCustomerSignupOnCartPage", "cobrand") &&
        (!sessionStorage.getItem("callCenterType")
          || sessionStorage.getItem("callCenterType") === ""
          || sessionStorage.getItem("callCenterType") === "undefined")) {
        this.addCustomer(data, this.setpersonate)
      }
      else {
        this.addTravellersCall(data);
      }
    }

  };
  addCustomer = (reqData, callBack) => {
    this.setState({
      customerCrateErrorMsg: "",
    });
    let agentEmail = this.props.userInfo.contactInformation.email;
    if (agentEmail.toLowerCase() === reqData.find(x => x.count === 0).data.email) {
      this.setState({
        customerCrateErrorMsg:
          "Kindly change email with customer email, as given email belowngs to agent. And booking should be done for customer only.",
      });
      return;
    }
    var reqURL = "api/v1/customer/create";

    var reqOBJ = {
      Request: {
        UserDisplayName: reqData.find(x => x.count === 0).data.email,
        FirstName: reqData.find(x => x.count === 0).data.firstname,
        LastName: reqData.find(x => x.count === 0).data.lastname,
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
        },
        ContactInformation: {
          PhoneNumber: reqData?.find(x => x.count === 0).data.phoneNumber.split('-')[1],
          PhoneNumberCountryCode: reqData?.find(x => x.count === 0).data.phoneNumber.split('-')[0] + "",
          Email: reqData?.find(x => x.count === 0).data.email,
        },
      },
      Flags: {
        validateEmailAndPhone: true,
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(reqData?.find(x => x.count === 0).data?.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (data?.response?.token) {
        sessionStorage.setItem("personateId", data.response.token);
      }
      if (data.status.code === 260031) {
        // && reqData.phoneNotoValidate !== reqData.phone
        this.setState({
          customerCrateErrorMsg:
            "Given phone number is associated with another customer. Kindly enter another phone number.",
        });
      } else {
        //this.setState({ isBtnLoading: false }, this.generateQuotation(reqData));
        callBack(reqData, this.addTravellersCall);
      }
    });
  };
  setpersonate = (travellerData, callback) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    let reqOBJ = {
      Request: travellerData.find(x => x.count === 0).data.email,
      config: { cartIdtobeUpdate: localStorage.getItem("cartLocalId") },
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.setItem("personateId", data.response);
        sessionStorage.setItem("callCenterType", "Customer");
        sessionStorage.setItem("bookingFor", travellerData.find(x => x.count === 0).data.firstname + ' ' + travellerData.find(x => x.count === 0).data.lastname);
        //sessionStorage.setItem("bookingForInfo", JSON.stringify(req.details));
        //localStorage.setItem("environment", JSON.stringify(data.response));
        //localStorage.removeItem("cartLocalId");
        callback(travellerData);
      }
    );
  };
  addTravellersCall = (data) => {
    const contact = data.find((x) => x.count === 0).data;
    const travellers = this.getTravellerData(contact, data);
    let reqURL = "api/v1/cart/travellers/add";
    let reqOBJ = this.getTravellersRequest(contact, travellers);

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        data = {
          "response": {
            "firstName": "",
            "lastName": ""
          }
        }

        if (this.state.continueAsGuest) {
          data.response.firstName = reqOBJ.contactDetails.FirstName;
          data.response.lastName = reqOBJ.contactDetails.LastName;
          this.props.handleLoginBox(data);
        }
        this.setAddons(reqOBJ, () => {
          this.setInputs(reqOBJ);
          if (this.state.page === "manualbookingcart") {
            this.bookManualItem(reqOBJ.contactDetails.Token);
          }
          else {
            this.props.history.push(`/Payment`);
          }
        });
      }.bind(this));
  };


  bookManualItem = (itineraryName) => {
    this.viewCart();
    this.getPaymentMode(itineraryName);
  };

  getTravellerData = (contact, data) => {
    let config = [];
    if (data.filter(x => x.count === -1).length > 0 && data.filter(x => x.count === -1)[0].data.isPayment) {
      let vals = Object.values(data.filter(x => x.count === -1)[0].data);
      config = Object.keys(data.filter(x => x.count === -1)[0].data).map((item, index) => {
        return {
          "key": "paymentInfo-" + item,
          "Value": vals[index]
        }
      });

      let cartItem = data.filter(x => x.count === -1)[0].data.cartItem;
      let configCartItem = cartItem.map(item => {
        return {
          "key": "paymentInfo-cart-item-" + item.cartItemID,
          "Value": item.bookingAmountEdit
        }
      });

      config = config.concat(configCartItem);
      config = config.filter(x => x.key !== "paymentInfo-cartItem")

    }

    if (data.filter(x => x.count === -2).length > 0 && data.filter(x => x.count === -2)[0].data.invoicetype) {
      config.push({
        Key: "invoicetype",
        Value: data.filter(x => x.count === -2)[0].data.invoicetype
      })
    }
    else if (data.filter(x => x.count === -2).length === 0
      && this.state.cart.items.filter(x => x.data.business === "package").length > 0
      && this.state.cart.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0) {
      config.push({
        Key: "invoicetype",
        Value: "withoutitemizedprice"
      });
    }
    if (this.state.isPaperRateBooking) {
      config.push({
        Key: "isPaperRateBooking",
        Value: true
      })
      config.push({
        Key: "seatTransactionToken",
        Value: this.state.seatTransactionToken
      })
      config.push({
        Key: "paperRateId",
        Value: this.state.PaperRateId
      })
    }
    data = data.filter(x => x.count !== -1);
    return data
      .filter((x) => x.count > 0)
      .map((traveller, key) => {
        traveller = traveller.data;

        let guestData = traveller.guests.map((guest, index) => {
          const tempPhoneNumber = parsePhoneNumberFromString(
            contact.phoneNumber
          );
          return {
            IsMainPax: index === 0 ? true : false,
            LocationInfo: {},
            Details: {
              FirstName: guest.data.firstName,
              LastName: guest.data.lastName,
              MiddleName: guest.data.middleName,
              Location: {
                City: contact.city,
                country: DropdownList.CountryList.find(
                  (x) => x.isoCode === contact.countryID
                ).name,
                countryID: contact.countryID,
              },
              ContactInformation: {
                Name: guest.data.firstName + " " + guest.data.lastName,
                phoneNumber: tempPhoneNumber
                  ? tempPhoneNumber.nationalNumber
                  : null,
                phoneNumberCountryCode: tempPhoneNumber
                  ? "+" + tempPhoneNumber.countryCallingCode
                  : null,
                Email: contact.email,
              },
              Age: moment().diff(guest.data.birthDate, "years"),
              GenderDesc: guest.data.gender,
              Gender:
                guest.data.gender.toLowerCase() === "male"
                  ? "M"
                  : guest.data.gender.toLowerCase() === "female"
                    ? "F"
                    : guest.data.gender,
              NationalityCode: guest.data.nationalityCode
                ? guest.data.nationalityCode
                : contact.countryID,
              BirthDate:
                guest.data.birthDate +
                (!guest.data.birthDate.includes("T") ? "T00:00:00" : ""),
              OpenIDs: {},
              documentType: guest.data.documentType,
              PassportExpirationDate: guest.data.passportExpirationDate,
              IssuingCountryCode: guest.data.issuingCountryCode,
              documentNumber:
                (guest.data.documentType === "PASSPORTNUMBER" || guest.data.documentType === "PANCARD")
                  ? guest.data.documentNumber
                  : guest.data.documentType === "NationalIDCard"
                    ? guest.data.socialSecurityNumber
                    : guest.data.documentNumber, // for transportation
              Documents: [
                {
                  type: guest.data.documentType,
                  Id:
                    (guest.data.documentType === "PASSPORTNUMBER" || guest.data.documentType === "PANCARD")
                      ? guest.data.documentNumber
                      : guest.data.socialSecurityNumber,
                  DateInfo: {
                    EndDate: guest.data.passportExpirationDate
                      ? guest.data.passportExpirationDate
                      : "" +
                      (guest.data.passportExpirationDate &&
                        !guest.data.passportExpirationDate.includes("T")
                        ? "T00:00:00"
                        : ""),
                  },
                  LocationInfo: {
                    FromLocation: {
                      CountryID: guest.data.issuingCountryCode,
                    },
                  },
                  RawData: guest.data.rawData,
                  URL: guest.data.url,
                },
              ]
            },
            Age: moment().diff(guest.data.birthDate, "years"),
            Addons: [],
            SpecialReq: this.getAddons(guest),
            SpecialReqInputs: this.getInputs(guest),
            Documents: [
              {
                type: guest.data.documentType,
                Id:
                  (guest.data.documentType === "PASSPORTNUMBER" || guest.data.documentType === "PANCARD")
                    ? guest.data.documentNumber
                    : guest.data.socialSecurityNumber,
                DateInfo: {
                  EndDate: guest.data.passportExpirationDate
                    ? guest.data.passportExpirationDate
                    : "" +
                    (guest.data.passportExpirationDate &&
                      !guest.data.passportExpirationDate.includes("T")
                      ? "T00:00:00"
                      : ""),
                },
                LocationInfo: {
                  FromLocation: {
                    CountryID: guest.data.issuingCountryCode,
                  },
                },
                RawData: guest.data.rawData,
                URL: guest.data.url,
              },
            ],
            //stopInfo: this.getStopInfo(guest),
            BookingDetails:
            // this.state.isPaperRateBooking ? {
            //   //isBoardingPassValid: true
            //   businessObjectItemID: guest.data.token,
            //   businessObjectItemCode: guest.data.code,
            //   ETicketNo: guest.data.eticketno
            // } : 
            {
              businessObjectItemID: guest.data.token,
              businessObjectItemCode: guest.data.code,
            },
            TypeString: guest.data.typeString,
            description: this.state.specialRequest.find(
              (x) => x.cartItemID === key
            )
              ? this.state.specialRequest.find((x) => x.cartItemID === key)
                .value
              : null,
            config: config,
            Flags: {
              saveAsCoTraveler: guest.data.isSaveTraveler,
              saveasguestcustomer: this.state.continueAsGuest,
            },
          };
        });

        return {
          code: this.state.cart.items[key].cartItemID,
          type: this.state.cart.items[key].cartItemID,
          Item: [].concat.apply([], guestData),
          Config: [],
        };
      });
  };

  getTravellersRequest = (contact, travellers) => {
    //Parse mobile number object
    const tempPhoneNumber = parsePhoneNumberFromString(contact.phoneNumber);

    return {
      contactDetails: {
        LoginName: contact.email,
        FirstName: contact.firstname,
        LastName: contact.lastname,
        Location: {
          City: contact.city,
          country: DropdownList.CountryList.find(
            (x) => x.isoCode === contact.countryID
          ).name,
          countryID: contact.countryID,
        },
        ContactInformation: {
          phoneNumber: tempPhoneNumber ? tempPhoneNumber.nationalNumber : null,
          phoneNumberCountryCode: tempPhoneNumber
            ? "+" + tempPhoneNumber.countryCallingCode
            : null,
          Email: contact.email,
        },
        Gender:
          contact.gender === "Male" ? "M" : contact.gender === "M" ? "M" : "F",
        Token: contact.itineraryname,
      },
      Request: {
        cartID: this.state.cartId,
        token: this.state.token,
        Data: travellers,
      },
    };
  };

  getAddons = (guest) => {
    let specialReq = [];
    guest.data.mealType && specialReq.push(guest.data.mealType);
    guest.data.seatType && specialReq.push(guest.data.seatType);
    guest.data.baggageDepType && specialReq.push(guest.data.baggageDepType);
    guest.data.baggageArrType && specialReq.push(guest.data.baggageArrType);
    guest.data.requestType && specialReq.push(guest.data.requestType);
    guest.data.visaFeeType && specialReq.push(guest.data.visaFeeType);
    if (guest.data.business !== "groundservice" && guest.data.additionalServices)
      specialReq = specialReq.concat(guest.data.additionalServices);
    return specialReq;
  };

  getStopInfo = (guest) => {
    if (guest.data.business !== undefined && guest.data.business === "transfers") {

      if (!guest.data.IsRoundTrip && guest.data.Types.split("|")[0] === "PickupAccomodation" && guest.data.Types.split("|")[1] === "DropoffAccomodation") {
        return [
          {
            code: "pickup",
            type: "Accommodation",
            item: [
              {
                type: guest.data.pickuphotelname,
                name: guest.data.pickuphotelname,
                time: !guest.data.pickupfromdate.includes("T") ? (guest.data.pickupfromdate + "T00:00:00") : guest.data.pickupfromdate,
                hour: guest.data.pickuptime.split(":")[0],
                minute: guest.data.pickuptime.split(":")[1],
                comments: guest.data.otherdetailspickuphotelname
              }
            ],
            config: [
              {
                key: "direction",
                value: ""
              }
            ]
          },
          {
            code: "dropoff",
            type: "Accommodation",
            item: [
              {
                type: guest.data.dropoffhotelname,
                name: guest.data.dropoffhotelname,
                comments: guest.data.otherdetailsdropoffhotelname
              }
            ],
            config: [
              {
                key: "direction",
                value: ""
              }
            ]
          }
        ]
      }
      else if (guest.data.IsRoundTrip && guest.data.Types.split("|")[0] === "PickupAccomodation" && guest.data.Types.split("|")[1] === "DropoffAccomodation") {
        return [
          {
            code: "pickup",
            type: "Accommodation",
            item: [
              {
                type: guest.data.pickuphotelname,
                name: guest.data.pickuphotelname,
                time: !guest.data.pickupfromdate.includes("T") ? (guest.data.pickupfromdate + "T00:00:00") : guest.data.pickupfromdate,
                hour: guest.data.pickuptime.split(":")[0],
                minute: guest.data.pickuptime.split(":")[1],
                comments: guest.data.otherdetailspickuphotelname

              }
            ],
            config: [
              {
                key: "direction",
                value: ""
              }
            ]
          },
          {
            code: "dropoff",
            type: "Accommodation",
            item: [
              {
                type: guest.data.dropoffhotelname,
                name: guest.data.dropoffhotelname,
                comments: guest.data.otherdetailsdropoffhotelname
              }
            ],
            config: [
              {
                key: "direction",
                value: ""
              }
            ]
          },
          {
            code: "pickup",
            type: "Accommodation",
            item: [
              {
                type: guest.data.returnpickuphotelname,
                name: guest.data.returnpickuphotelname,
                time: !guest.data.returnpickupfromdate.includes("T") ? (guest.data.returnpickupfromdate + "T00:00:00") : guest.data.returnpickupfromdate,
                hour: guest.data.returnpickuptime.split(":")[0],
                minute: guest.data.returnpickuptime.split(":")[1],
                comments: guest.data.otherdetailsreturnpickuphotelname
              }
            ],
            config: [
              {
                key: "direction",
                value: "roundtrip"
              }
            ]
          },
          {
            code: "dropoff",
            type: "Accommodation",
            item: [
              {
                type: guest.data.returndropffhotelname,
                name: guest.data.returndropffhotelname,
                comments: guest.data.otherdetailsreturndropoffhotelname
              }
            ],
            config: [
              {
                key: "direction",
                value: "roundtrip"
              }
            ]
          }
        ]
      }
      if (!guest.data.IsRoundTrip && guest.data.Types.split("|")[0] === "PickupAirport" && guest.data.Types.split("|")[1] === "DropoffAirport") {
        return [
          {
            type: "departure",
            item: [
              {
                type: guest.data.pickuphotelname,
                name: guest.data.pickuphotelname,
                time: !guest.data.pickupfromdate.includes("T") ? (guest.data.pickupfromdate + "T00:00:00") : guest.data.pickupfromdate,
                hour: guest.data.pickuptime.split(":")[0],
                minute: guest.data.pickuptime.split(":")[1],
                comments: guest.data.otherdetailspickuphotelname

              },
              {
                type: guest.data.pickuphotelname,
                name: guest.data.pickuphotelname,
                time: !guest.data.pickupfromdate.includes("T") ? (guest.data.pickupfromdate + "T00:00:00") : guest.data.pickupfromdate,
                hour: guest.data.pickuptime.split(":")[0],
                minute: guest.data.pickuptime.split(":")[1],
                comments: guest.data.otherdetailspickuphotelname

              }
            ]
          },
          {
            type: "arrival",
            item: [
              {
                type: guest.data.dropoffhotelname,
                name: guest.data.dropoffhotelname,
                comments: guest.data.otherdetailsdropoffhotelname
              }
            ]
          }
        ]
      }
    }
    else
      return [];
  };

  setAddons = (req, callBack) => {
    let reqURL = "api/v1/cart/addons/add";
    let reqOBJ = {
      Request: {
        CartID: req.Request.cartID,
        //Data: req.Request.Data[0].Item.flatMap((id) => id && id.SpecialReq),
        Data: [...new Set(req.Request.Data.flatMap(item => { return item.Item.flatMap((id) => id && id.SpecialReq) }))],
      },
    };

    reqOBJ.Request.Data.length > 0
      ? apiRequester(reqURL, reqOBJ, () => {
        callBack();
      })
      : callBack();
  };

  getInputs = (guest) => {
    let specialReqInputs = [];
    if (guest.data.business !== undefined && guest.data.business === "transfers") {
      {
        [...Array(guest.data.AvailableInputs.length).keys()].map(inputcount => {

          if ((guest.data.AvailableInputs[inputcount].code.includes("pickup0") || guest.data.AvailableInputs[inputcount].code.includes("pickup2"))) {
            //Pickup details
            if (guest.data.AvailableInputs[inputcount].item[0].id.includes("accommodation")) {
              //Accomodation case
              {
                [...Array(guest.data.AvailableInputs[inputcount].item.length).keys()].map(count => {
                  if (guest.data.AvailableInputs[inputcount].code.includes("pickup0")) {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.pickuphotelname]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [moment(guest.data.pickupfromdate).format('MM/DD/YYYY 00:00:00')]
                          })
                        )
                        : (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.pickuptime.replace(":", ",")]
                          })
                        )
                  }
                  else {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.returnpickuphotelname]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [moment(guest.data.returnpickupfromdate).format('MM/DD/YYYY 00:00:00')]
                          })
                        )
                        : (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.returnpickuptime.replace(":", ",")]
                          })
                        )
                  }
                })
              }
            }
            else {
              //Airport case
              {
                [...Array(guest.data.AvailableInputs[inputcount].item.length).keys()].map(count => {
                  if (guest.data.AvailableInputs[inputcount].code.includes("pickup0")) {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Combo" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.AvailableInputs[inputcount].item[count].lookup.toLowerCase() === "airline" ? guest.data.arrivingairline.split("_")[0] : guest.data.arrivingfromaddress.split("_")[0]]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.arrivingflightno]
                          })
                        )
                        : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                          (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [moment(guest.data.arrivingfromdate).format('MM/DD/YYYY 00:00:00')]
                            })
                          )
                          : (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [guest.data.arrivingtime.replace(":", ",")]
                            })
                          )
                  }
                  else {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Combo" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.AvailableInputs[inputcount].item[count].lookup.toLowerCase() === "airline" ? guest.data.returnarrivingairline.split("_")[0] : guest.data.returnarrivingfromaddress.split("_")[0]]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.returnarrivingflightno]
                          })
                        )
                        : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                          (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [moment(guest.data.returnarrivingfromdate).format('MM/DD/YYYY 00:00:00')]
                            })
                          )
                          : (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [guest.data.returnarrivingtime.replace(":", ",")]
                            })
                          )
                  }
                })
              }
            }
          }
          else {
            //Dropoff details
            if (guest.data.AvailableInputs[inputcount].item[0].id.includes("accommodation")) {
              //Accomodation case
              {
                [...Array(guest.data.AvailableInputs[inputcount].item.length).keys()].map(count => {
                  if (guest.data.AvailableInputs[inputcount].code.includes("dropoff1")) {
                    if (guest.data.AvailableInputs[inputcount].item[count].type === "Textbox") {
                      specialReqInputs.push({
                        Key: guest.data.AvailableInputs[inputcount].item[count].id,
                        Value: [guest.data.dropoffhotelname]
                      })
                    }
                  }
                  else {
                    if (guest.data.AvailableInputs[inputcount].item[count].type === "Textbox") {
                      specialReqInputs.push({
                        Key: guest.data.AvailableInputs[inputcount].item[count].id,
                        Value: [guest.data.returndropffhotelname]
                      })
                    }
                  }
                })
              }
            }
            else {
              //Airport case
              {
                [...Array(guest.data.AvailableInputs[inputcount].item.length).keys()].map(count => {
                  if (guest.data.AvailableInputs[inputcount].code.includes("dropoff1")) {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Combo" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.AvailableInputs[inputcount].item[count].lookup.toLowerCase() === "airline" ? guest.data.departingairline.split("_")[0] : guest.data.departingfromaddress.split("_")[0]]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.departingflightno]
                          })
                        )
                        : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                          (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [moment(guest.data.departingfromdate).format('MM/DD/YYYY 00:00:00')]
                            })
                          )
                          : (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [guest.data.departingtime.replace(":", ",")]
                            })
                          )
                  }
                  else {
                    guest.data.AvailableInputs[inputcount].item[count].type === "Combo" ?
                      (
                        specialReqInputs.push({
                          Key: guest.data.AvailableInputs[inputcount].item[count].id,
                          Value: [guest.data.AvailableInputs[inputcount].item[count].lookup.toLowerCase() === "airline" ? guest.data.returndepartingairline.split("_")[0] : guest.data.returndepartingfromaddress.split("_")[0]]
                        })
                      )
                      : guest.data.AvailableInputs[inputcount].item[count].type === "Textbox" ?
                        (
                          specialReqInputs.push({
                            Key: guest.data.AvailableInputs[inputcount].item[count].id,
                            Value: [guest.data.returndepartingflightno]
                          })
                        )
                        : guest.data.AvailableInputs[inputcount].item[count].type === "DatePicker" ?
                          (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [moment(guest.data.returndepartingfromdate).format('MM/DD/YYYY 00:00:00')]
                            })
                          )
                          : (
                            specialReqInputs.push({
                              Key: guest.data.AvailableInputs[inputcount].item[count].id,
                              Value: [guest.data.returndepartingtime.replace(":", ",")]
                            })
                          )
                  }
                })
              }
            }
          }
        })
      }
    } else if (guest.data.business !== undefined && guest.data.business === "groundservice"
      && guest.data.additionalServices.length > 0
      && guest.data.additionalServices.filter(
        (x) => x.Selected === true
      ).length > 0) {
      guest.data.additionalServices.filter(
        (x) => x.Selected === true
      ).map((item) => {
        specialReqInputs.push({
          Key: item.id,
          Value: [item.Quantity]
        })
      });
    } else if (guest.data.business !== undefined && guest.data.business !== "groundservice" && guest.data.AvailableInputs) {
      {
        [...Array(guest.data.AvailableInputs.filter(x => x.type === "supplierquestions" && x.code === guest.count).length).keys()].map(inputcount => {
          {
            [...Array(guest.data.AvailableInputs.filter(x => x.type === "supplierquestions" && x.code === guest.count)[inputcount].item.length).keys()].map(count => {
              let val = "add_";
              val = val + guest.data.AvailableInputs.filter(x => x.type === "supplierquestions" && x.code === guest.count)[inputcount].item[count].id.toLowerCase();
              specialReqInputs.push({
                Key: guest.data.AvailableInputs.filter(x => x.type === "supplierquestions" && x.code === guest.count)[inputcount].item[count].id,
                Value: [guest.data[val]]
              })
            })
          }
        })
      }
    }
    else if (localStorage.getItem("umrahPackageDetails") && //localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" &&
      ((guest.data.business !== undefined && guest.data.business !== "groundservice") || (guest.business !== undefined && guest.business === "hotel")) &&
      guest.data.AvailableInputs) {
      let umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"))
      if (umrahPackageDetails.umrahFlight) {
        specialReqInputs = specialReqInputs.concat(guest.data.AvailableInputs);
      }
    }
    else {
      guest.data.flyerCard &&
        specialReqInputs.push({
          Key: guest.data.flyerCard,
          Value: [guest.data.flyerCardNumber],
        });
    }
    return specialReqInputs;
  };

  setInputs = (req) => {
    let reqURL = "api/v1/cart/inputs/add";
    let reqOBJ = {
      Request: {
        CartID: req.Request.cartID,
        Data: [...new Set(req.Request.Data.flatMap(item => { return item.Item.flatMap((id) => id && id.SpecialReqInputs) }))],
      },
    };

    reqOBJ.Request.Data.length > 0 &&
      apiRequester(reqURL, reqOBJ, function () { });
  };

  handleShowSpecialRequest = (cartItemID) => {
    let value = this.state.specialRequest.find(
      (x) => x.cartItemID === cartItemID
    )
      ? this.state.specialRequest.find((x) => x.cartItemID === cartItemID).value
      : "";
    this.setState({
      showPopup: true,
      popupTitle: Trans("_haveSpecialRequest"),
      popupContent: (
        <HotelSpecialRequest
          cartItemID={cartItemID}
          specialRequestvalue={value}
          handleHidePopup={this.handleHidePopupSpecialRequest}
        />
      ),
    });
  };

  showVehicletermsCondition = (itemtoken, cartid) => {
    this.setState({
      PolicyHTML: null,
      showPopup: true,
      popupTitle: Trans("_bookingTermsPopupTitle"),
      popupContent: <Loader />,
    });
    var reqURL = "api/v1/vehicle/policy";
    var reqOBJ = {
      Request: {
        Token: this.state.cart.items[cartid].token,
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
            )
          });
        }
        if (!isPolicyExist) PolicyHTML = <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>;
        this.setState({
          showPopup: true,
          popupTitle: Trans("_bookingTermsPopupTitle"),
          popupContent: PolicyHTML,
        });
      }.bind(this)
    );
  }

  handleHidePopupSpecialRequest = (value, cartItemID) => {
    let specialRequest = this.state.specialRequest;
    if (specialRequest.find((x) => x.cartItemID === cartItemID))
      specialRequest.find((x) => x.cartItemID === cartItemID).value = value;
    else specialRequest.push({ cartItemID: cartItemID, value: value });
    this.setState({
      specialRequest: specialRequest,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
    });
  };

  handleAirFareRules = (cartSequenceId, cartData) => {
    this.setState({
      showPopup: true,
      popupTitle: Trans("_priceRules"),
      popupContent: (
        <ResultItemAirFareRule
          {...cartData}
          tripLocationDetails={cartData.items[0].locationInfo}
          tripType={cartData.tripType}
          searchToken={this.state.cart.items[cartSequenceId].token}
          flightOptionToken={cartData.token}
          activeTab={"price"}
          fromPage={"cart-section"}
          fareRules={this.state.fareRules}
          handlefareRules={this.handlefareRules}
        />
      ),
    });
  };

  handlefareRules = (fareRules) => {
    this.setState({
      fareRules,
    });
  };

  handleChangeTabs = (itemToken, activeTab) => { };

  removeCartItemConfirm = (cartid) => {
    let itemName = "";

    if (this.state.cart.items[cartid].data.business === "air") {
      if (this.state.cart.items[cartid].data.tripType === "roundtrip")
        itemName = this.state.cart.items[cartid].data.items.reduce(
          (itemName, item) => {
            itemName +=
              itemName === ""
                ? item.locationInfo.fromLocation.id +
                " - " +
                item.locationInfo.toLocation.id
                : " - " + item.locationInfo.toLocation.id;
            return itemName;
          },
          ""
        );
      else {
        itemName =
          this.state.cart.items[cartid].data.items[0].locationInfo.fromLocation
            .id +
          " - " +
          this.state.cart.items[cartid].data.items[0].locationInfo.toLocation
            .id;
      }
    } else {
      itemName = this.state.cart.items[cartid].data.name;
    }
    this.setState({
      showPopup: true,
      popupTitle: Trans("_areYouSureConfirmation"),
      popupContent: (
        <div>
          <div>
            {Trans("_areYouSureWishToRemove")} '{itemName}
            '?
          </div>
          <button
            className="btn btn-primary pull-right m-1 "
            onClick={() => this.removeCartItem(true, cartid)}
          >
            {Trans("_yes")}
          </button>

          <button
            className="btn btn-primary pull-right m-1 "
            onClick={() => this.removeCartItem(false, cartid)}
          >
            {Trans("_no")}
          </button>
        </div>
      ),
    });
  };

  removeCartItem = (isConfirm, cartid) => {
    if (!isConfirm) {
      this.setState({
        showPopup: false,
        popupTitle: "",
        popupContent: null,
      });
      return;
    }
    this.setState({
      showPopup: false,
      isRemoveCartLoading: cartid,
    });
    if (Config.codebaseType === "tourwiz") {
      const isTWPackage = this.state.cart.items.filter(x => x.data.business === "package").length > 0
        && this.state.cart.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0;
      if (isTWPackage) {
        this.clearCart();
        return;
      }
    }
    let reqURL = "api/v1/cart/remove";

    let data = {
      key:
        this.state.cart.items[cartid].data.business === "air"
          ? this.state.cart.items[cartid].cartItemID
          : (this.state.cart.items[cartid].data.business === "vehicle" || this.state.cart.items[cartid].data.business === "transportation" || this.state.cart.items[cartid].data.business === "groundservice")
            ? this.state.cart.items[cartid].data.token
            : this.state.cart.items[cartid].data.id,
      value:
        (this.state.cart.items[cartid].data.business === "vehicle" || this.state.cart.items[cartid].data.business === "air")
          ? this.state.cart.items[cartid].data.token
          : this.state.cart.items[cartid].data.items[0].id,
      SecondaryBusinessObjectItemId: this.state.cart.items[cartid].data.items[0]
        .id,
    };
    let reqOBJ = {
      request: {
        cartID: this.state.cart.items[cartid].cartID,
        token: this.state.cart.items[cartid].token,
        data: data,
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          errorMessages: []
        });
        if (this.state.page === "cart" || this.state.page === "manualbookingcart" || this.state.page === "cart-icon") {
          this.releasePaperRatesSeats();
          this.viewCart();
        } else {
          this.setState({
            showPopup: true,
            popupTitle: Trans("_removeItinerary"),
            popupContent: Trans("_removeItinerary1"),
          });
          if (
            this.state.cart.items.filter((x) => x.availabilityStatus === 3)
              .length > 0 &&
            this.state.cart.items.length > 0 &&
            this.state.cart.items.length >=
            this.state.cart.items.filter((x) => x.availabilityStatus === 3)
              .length
          ) {
            this.releasePaperRatesSeats();
            this.viewCart();
          }
        }
      }.bind(this)
    );
  };
  clearCart = () => {
    var reqURL = "api/v1/cart/clear";
    var reqOBJ = {
      Request: {
        CartID: this.state.cartId,
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        localStorage.removeItem("cartLocalId")
        this.setState({
          showPopup: true,
          popupTitle: Trans("_removeItinerary"),
          popupContent: Trans("_removeItinerary1"),
        });
      }.bind(this)
    );
  };
  releasePaperRatesSeats = () => {
    this.setState({ ispaperratetimeexpire: true });
    var reqURL = "paperrates/release";

    var reqOBJ = {
      token: this.state.seatTransactionToken
    };

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.message) {

        }
      },
      "POST"
    );
  };

  handleHidePopup = () => {
    this.setState({
      showPopup: false,
      popupTitle: "",
      popupContent: null,
    });
  };

  getPaymentMode = (itineraryName) => {
    var reqURL = "api/v1/application/environment";
    var reqOBJ = {
      Request: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({ paymentMode: data.response });
        if (this.state.page === "manualbookingcart") {
          this.viewCart();
          this.bookCart(itineraryName);
        }
      }.bind(this)
    );
  };

  setPaymentMode = (e) => {
    this.setState({
      selectedPaymentMode: e,
    });
  };

  bookCart = (itineraryName) => {
    if (typeof itineraryName === 'object')
      itineraryName = '';

    if (this.state.isBtnLoading) return;

    if (!this.validateBookCart()) {
      return;
    }
    this.setState({
      isBtnLoading: true,
    });
    if (this.state.isPaperRateBooking) {
      if (this.CheckPaperRatesSeatAvailability()) {
        let selectedPaymentMode = this.state.page === "manualbookingcart" ? "agentbalance" : this.state.selectedPaymentMode.toLowerCase();
        let paymentMode = this.state.paymentMode.paymentGatewayInputInfo.find(
          (x) => x.code.toLowerCase() === selectedPaymentMode
        );

        var reqURL = "api/v1/cart/book";
        var reqOBJ = {
          paymentGatewayID: paymentMode.code,
          paymentReturnUrl:
            //window.location.origin + "/BookingStatus/" + this.state.cartId,
            window.location.origin + (window.location.pathname.toLocaleLowerCase() === '/be.aspx' ? '/be.aspx/' : '/')
            + "BookingStatus/" + this.state.cartId,
          Request: this.state.cartId,
          Flags: {},
          ItineraryName: itineraryName ? itineraryName : this.state.page === "manualbookingcart" ? "booking for" : this.state.cart.travellers.contactDetails[0].details.token,
        };

        apiRequester(
          reqURL,
          reqOBJ,
          function (data) {
            if (data.status.code === 260030) {
              this.setState({
                isBtnLoading: false,
                isLoading: true,
                PriceChangeSoldOut: [],
              });
              this.viewCart();
            }
            else if (data.status.code === 41081) {
              this.setState({
                isBtnLoading: false,
                isLoading: true,
                PriceChangeSoldOut: [],
                showPopup: true,
                popupTitle: Trans("_ooops"),
                popupContent: Trans("_error_customer_insufficientBalance")
              });
              this.viewCart();
            } else {
              window.location.href = Config.paymentInitUrl + data.response.data;
              /*var paymentInitUrl = (window.location.host.toString().split(".").length === 2)
                ? "https://dxcore." + window.location.host + "/"
                : (window.location.host.toString().split(".").length > 2)
                  ? "https://dxcore." + window.location.host.replace(window.location.host.toString().split(".")[0] + ".", "") + "/"
                  : Config.paymentInitUrl;
              if (window.location.host !== "localhost:3000") {
                window.location.href = paymentInitUrl + "v1/pg/init/" + data.response.data;
              }
              else {
                window.location.href = paymentInitUrl + data.response.data;
              }*/
            }
          }.bind(this)
        );
      }
      else {
        let cart = this.state.cart;
        cart.items[0].availabilityStatus = 5;
        this.setState({
          cart: cart
        });
      }
    }
    else {
      let selectedPaymentMode = this.state.page === "manualbookingcart" ? "agentbalance" : this.state.selectedPaymentMode.toLowerCase();
      let paymentMode = this.state.paymentMode.paymentGatewayInputInfo.find(
        (x) => x.code.toLowerCase() === selectedPaymentMode
      );

      var reqURL = "api/v1/cart/book";
      var reqOBJ = {
        paymentGatewayID: paymentMode.code,
        paymentReturnUrl:
          //window.location.origin + "/BookingStatus/" + this.state.cartId,
          window.location.origin + (window.location.pathname.toLocaleLowerCase() === '/be.aspx' ? '/be.aspx/' : '/')
          + "BookingStatus/" + this.state.cartId,
        Request: this.state.cartId,
        Flags: {},
        ItineraryName: itineraryName ? itineraryName : this.state.page === "manualbookingcart" ? "booking for" : this.state.cart.travellers.contactDetails[0].details.token,
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.status.code === 260030) {
            this.setState({
              isBtnLoading: false,
              isLoading: true,
              PriceChangeSoldOut: [],
            });
            this.viewCart();
          }
          else if (data.status.code === 41081) {
            this.setState({
              isBtnLoading: false,
              isLoading: true,
              PriceChangeSoldOut: [],
              showPopup: true,
              popupTitle: Trans("_ooops"),
              popupContent: Trans("_error_customer_insufficientBalance")
            });
            this.viewCart();
          } else {
            window.location.href = Config.paymentInitUrl + data.response.data;
            /*var paymentInitUrl = (window.location.host.toString().split(".").length === 2)
              ? "https://dxcore." + window.location.host + "/"
              : (window.location.host.toString().split(".").length > 2)
                ? "https://dxcore." + window.location.host.replace(window.location.host.toString().split(".")[0] + ".", "") + "/"
                : Config.paymentInitUrl;
            if (window.location.host !== "localhost:3000") {
              window.location.href = paymentInitUrl + "v1/pg/init/" + data.response.data;
            }
            else {
              window.location.href = paymentInitUrl + data.response.data;
            }*/
          }
        }.bind(this)
      );
    }

  };

  validateBookCart = () => {
    let errorMessages = [];
    if (this.state.page !== "manualbookingcart" && !this.state.agreeCondition)
      errorMessages.push(Trans("_pleaseAcceptTermsAndConditions"));

    if (this.state.page !== "manualbookingcart" &&
      !localStorage.getItem("isUmrahPortal") &&
      Object.keys(this.state.cart.paymentGatewayCharges).filter(
        (x) => x.toLowerCase() === "holdbooking"
      ).length === 0 &&
      !this.state.agreeNonRefundable
    )
      errorMessages.push(Trans("_pleaseagreeNonRefundable"));

    if (
      this.state.cart.items.filter((x) => x.availabilityStatus === 3).length > 0
    )
      errorMessages.push(Trans("_error_payment_soldout_itinerary_message"));

    if (errorMessages.length > 0) {
      this.setState({
        isBtnLoading: false,
        errorMessages: errorMessages,
      });
      return false;
    }

    this.setState({
      isBtnLoading: false,
      errorMessages: errorMessages,
    });
    return true;
  };

  handleShowTerms = () => {
    this.setState({
      showPopup: true,
      popupTitle: Trans("_termsAndConditions"),
      popupContent: (
        <HtmlParser
          text={(Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== null && Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== "") ? Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") : Trans("_noPolicyFound")}
        />
      ),
    });
  };

  handleHideTerms = () => {
    this.setState({
      showPopup: false,
      popupTitle: "",
      popupContent: null,
    });
  };

  agreeCondition = () => {
    this.setState({
      agreeCondition: !this.state.agreeCondition,
    });
  };

  agreeNonRefundable = () => {
    this.setState({
      agreeNonRefundable: !this.state.agreeNonRefundable,
    });
  };
  hidePricechange = (cartItemID) => {
    let PriceChangeSoldOut = this.state.PriceChangeSoldOut;
    if (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID))
      PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID).value = "false";
    this.setState({
      PriceChangeSoldOut: PriceChangeSoldOut
    });
  };
  renderCartAvailabilityChanged = () => {
    let PriceChangeSoldOut = this.state.PriceChangeSoldOut;
    return this.state.cart.items.map((item, key) => {
      let oldAmount = item.data.displayOriginalAmount;
      let newAmount = item.data.displayAmount;
      let business = item.data.business;
      let itemName = item.data.name;
      if (business === "transportation") {
        itemName = item.data.stopInfo[0].item[0].name;
      }
      if (business === "air") {
        const name = item.data.locationInfo;
        name.fromLocation = name.fromLocation || name.FromLocation;
        name.toLocation = name.toLocation || name.ToLocation;
        itemName =
          name.fromLocation.id +
          " - " +
          name.toLocation.id +
          (item.data.tripType === "roundtrip"
            ? " - " + name.fromLocation.id
            : "");
      }
      let cartItemID = this.state.cart.items.length > 1 ? "ItineraryItem" + (key + 1) : "ItineraryItem1";
      if (PriceChangeSoldOut.length === 0) {
        PriceChangeSoldOut.push({ cartItemID: (this.state.cart.items.length > 1 ? "ItineraryItem" + (key + 1) : "ItineraryItem1"), value: "true" });
      }
      if (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID)) {
      }
      else {
        PriceChangeSoldOut.push({ cartItemID: (this.state.cart.items.length > 1 ? "ItineraryItem" + (key + 1) : "ItineraryItem1"), value: "true" });
      }

      if (item.availabilityStatus === 1 && (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID) && PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID).value === "true")) {
        //Price Change
        return (
          <div className="alert alert-info">
            <h5 className="border-bottom pb-3 mb-3">
              {Trans("_" + business + "PriceChangeMessage1")}
              <button
                type="button"
                className="close"
                onClick={() => this.hidePricechange(cartItemID)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            {business !== "transfers" &&
              <p className="mt-3">
                {this.state.cart.items.length > 1 ? (Trans("_itineraryNumber") + " : " +
                  (key + 1) +
                  ", " +
                  itemName) : itemName}, {" " + Trans("_date") + " : "}
                <Date date={item.data.dateInfo.startDate} />
                {business !== "activity" && business !== "package" && business !== "transportation" && business !== "groundservice" && " -  "}
                {business !== "activity" && business !== "package" && business !== "transportation" && business !== "groundservice" && (
                  <Date date={item.data.dateInfo.endDate} />
                )}
              </p>
            }

            {business === "transfers" &&
              <p className="mt-3">
                {this.state.cart.items.length > 1 ? (Trans("_itineraryNumber") + " : " +
                  (key + 1) +
                  ", " +
                  itemName) : itemName}, {" " + Trans("_date") + " : "}
                <Date date={item.data.dateInfo.startDate} />
                {item.data.IsRoundTrip && " -  "}
                {item.data.IsRoundTrip && (
                  <Date date={item.data.dateInfo.endDate} />
                )}
              </p>
            }

            <p className="mt-3">
              {Trans("_" + business + "PriceChangeMessage2")}
            </p>
            <p className="mt-3">
              {" "}
              {Trans("_" + business + "PriceChangeMessage3")}
            </p>
            <div className="mt-3">
              <span>{Trans("_oldPrice")} : </span>
              <b>{oldAmount}</b>
            </div>
            <div className="mt-3">
              <span>{Trans("_newPrice")} : </span>
              <b>{newAmount}</b>
            </div>
          </div>
        );
      } else if (item.availabilityStatus === 3 && (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID) && PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID).value === "true")) {
        return (
          <div className="alert alert-info">
            <h5 className="border-bottom pb-3 mb-3">
              {/* {Trans("_soldOutMessage")}{" "} */}
              {Trans("_" + business + "SoldOutMessage1")}
              <button
                type="button"
                className="close"
                onClick={() => this.hidePricechange(cartItemID)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            {business !== "transfers" &&
              <p className="mt-3">
                {this.state.cart.items.length > 1 ? (Trans("_itineraryNumber") +
                  " : " +
                  (key + 1) +
                  ", " +
                  itemName +
                  ", " +
                  Trans("_date") +
                  " : ") : (itemName +
                    ", " +
                    Trans("_date") +
                    " : ")}
                <Date date={item.data.dateInfo.startDate} />
                {business !== "transportation" &&
                  business !== "groundservice" &&
                  business !== "activity" &&
                  business !== "package" &&
                  ", " + Trans("_checkOut") + " : "}
                {business !== "transportation" && business !== "groundservice" && business !== "activity" && business !== "package" && (
                  <Date date={item.data.dateInfo.endDate} />
                )}
              </p>
            }
            {business === "transfers" &&
              <p className="mt-3">
                {Trans("_itineraryNumber") +
                  " : " +
                  (key + 1) +
                  ", " +
                  itemName +
                  ", " +
                  (!item.data.IsRoundTrip ? Trans("_transfersDate") : Trans("_widgettransfersFromDate")) +
                  " : "}
                <Date date={item.data.dateInfo.startDate} />
                {item.data.IsRoundTrip &&
                  ", " + Trans("_widgettransfersCheckOut") + " : "}
                {item.data.IsRoundTrip && (
                  <Date date={item.data.dateInfo.endDate} />
                )}
              </p>
            }

            {Global.getEnvironmetKeyValue("isCart") ? (
              <button
                className="btn btn-link pl-0"
                onClick={() => this.removeCartItemConfirm(key, true)}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ) : ((Global.getEnvironmetKeyValue("portalType") === "B2B" ||
              Global.getEnvironmetKeyValue("portalType") === "BOTH") ? (
              <Link
                className="btn btn-link pl-0"
                to="/Search"
              >
                {Trans("_goToHomePage")}
              </Link>
            ) : (
              <button
                className="btn btn-link pl-0"
                onClick={() => { window.location = "/" }}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ))}
          </div>
        );
      }
      else if (item.availabilityStatus === 4 && (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID) && PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID).value === "true")) {
        return (
          <div className="alert alert-info">
            <h5 className="border-bottom pb-3 mb-3">
              {/* {Trans("_soldOutMessage")}{" "} */}
              {"Sorry !! Time Out"}
              <button
                type="button"
                className="close"
                onClick={() => this.hidePricechange(cartItemID)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            {business !== "transfers" &&
              <p className="mt-3">
                Time Out
              </p>
            }

            {Global.getEnvironmetKeyValue("isCart") ? (
              <button
                className="btn btn-link pl-0"
                onClick={() => this.removeCartItemConfirm(key, true)}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ) : ((Global.getEnvironmetKeyValue("portalType") === "B2B" ||
              Global.getEnvironmetKeyValue("portalType") === "BOTH") ? (
              <Link
                className="btn btn-link pl-0"
                to="/Search"
              >
                {Trans("_goToHomePage")}
              </Link>
            ) : (
              <button
                className="btn btn-link pl-0"
                onClick={() => { window.location = "/" }}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ))}
          </div>
        );
      }
      else if (item.availabilityStatus === 5 && (PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID) && PriceChangeSoldOut.find((x) => x.cartItemID === cartItemID).value === "true")) {
        return (
          <div className="alert alert-info">
            <h5 className="border-bottom pb-3 mb-3">
              {/* {Trans("_soldOutMessage")}{" "} */}
              {"Seats No Longer Available."}
              <button
                type="button"
                className="close"
                onClick={() => this.hidePricechange(cartItemID)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            {business !== "transfers" &&
              <p className="mt-3">
                Seats No Longer Available.
              </p>
            }

            {Global.getEnvironmetKeyValue("isCart") ? (
              <button
                className="btn btn-link pl-0"
                onClick={() => this.removeCartItemConfirm(key, true)}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ) : ((Global.getEnvironmetKeyValue("portalType") === "B2B" ||
              Global.getEnvironmetKeyValue("portalType") === "BOTH") ? (
              <Link
                className="btn btn-link pl-0"
                to="/Search"
              >
                {Trans("_goToHomePage")}
              </Link>
            ) : (
              <button
                className="btn btn-link pl-0"
                onClick={() => { window.location = "/" }}
              >
                {Trans("_removeItineraryMessage")}
              </button>
            ))}
          </div>
        );
      }
    });

  };

  handlePromoCode = (code) => {
    this.setState({ isPromoBtnLoading: true, promoCodeMsg: false });

    let reqURL = "api/v1/cart/inputs/add";
    let reqOBJ = {
      Request: {
        CartID: this.state.cartId,
        Data: [
          {
            Key: "promocode",
            Value: [code],
          },
        ],
      },
    };

    reqOBJ.Request.Data.length > 0 &&
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.viewCart();
          this.setState({
            promoCodeMsg: data.response.find(
              (x) => x.description === "Discount"
            ).amount,
            isPromoBtnLoading: false,
          });
        }.bind(this)
      );
  };

  removePromoCode = () => {
    this.setState({ isPromoBtnLoading: true, promoCodeMsg: false });

    const existingPromoCode = this.state.cart.inputs.appliedInputs.find(
      (x) => x.type === "promocode"
    );

    const existingPromoCodeId =
      existingPromoCode && existingPromoCode.item.find((x) => x.id).id;

    let reqURL = "api/v1/cart/inputs/remove";
    let reqOBJ = {
      Request: {
        CartID: this.state.cartId,
        Data: [existingPromoCodeId],
      },
    };

    reqOBJ.Request.Data.length > 0 &&
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.viewCart();
          this.setState({
            isPromoBtnLoading: false,
          });
        }.bind(this)
      );
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


    let isAirArrivalSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.toLocation === travelTo.arrivalAirLocationCode) !== undefined;
    if (!umrahPackageDetails.umrahFlight && FlightArrival && !isAirArrivalSelected) {
      validationMessage.push("Please select Arrival Flight.");

    }

    let isAirDepartureSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.fromLocation === travelTo.departureAirLocationCode) !== undefined;
    if (!umrahPackageDetails.umrahFlight && FlightDeparture && !isAirDepartureSelected) {
      validationMessage.push("Please select Departure Flight.");

    }

    let isHotelMakkahSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "hotel"
          && (x.offlineItem.fromLocation === travelTo.hotelLocationCode1)) !== undefined;
    if (HotelMakkah && !isHotelMakkahSelected) {
      validationMessage.push("Please select Makka Hotel");

    }

    let isHotelMadinahSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "hotel"
          && (x.offlineItem.fromLocation === travelTo.hotelLocationCode2)) !== undefined;
    if (HotelMadinah && !isHotelMadinahSelected) {
      validationMessage.push("Please select Madinah Hotel");

    }

    let isTransportationSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "transportation");
    if (Transportation && !isTransportationSelected) {
      validationMessage.push("Please select Transportaion");
    }

    let isGroundserviceSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "groundservice");
    if (GroundService && !isGroundserviceSelected) {
      validationMessage.push("Please select Ground Service");
    }

    return validationMessage;
  };

  getPaymentInformation = () => {
    {
      if (Global.getEnvironmetKeyValue("portalId") === "15594")
        return <div className="row" >
          <div className="col-6">
            <h6 className="bg-light p-3 border font-weight-bold text-capitalize m-0">
              <div className="d-inline-block">
                <label
                  className=""

                >
                  USD (Making Payments outside USA)
                </label>
              </div>
            </h6>
            <div className="border p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <div className="bg-light p-3">
                    <div className="row mb-2">
                      <span className="col-12">
                        TransferWise
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-12">
                        19 W 24th Street, New York NY 10010, United States Account holder -Bookitnow PTE. LTD.
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-12">
                        Swift Code - CMFGUS33
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-8">
                        Account number – 8310929433 USD
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-8">
                        &nbsp;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="col-6">
            <h6 className="bg-light p-3 border font-weight-bold text-capitalize m-0">
              <div className="d-inline-block">
                <label
                  className=""

                >
                  (Making Payments INSIDE USA)
                </label>
              </div>
            </h6>
            <div className="border p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <div className="bg-light p-3">
                    <div className="row mb-2">
                      <span className="col-12">
                        TransferWise
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-12">
                        19 W 24th Street, New York NY 10010, United States Account holder - Bookitnow PTE. LTD.
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-12">
                        Routing number - 084009519
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-8">
                        Account number - 9600000000370709
                      </span>
                    </div>
                    <div className="row mb-2">
                      <span className="col-8">
                        Account type - Checking
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    }
  }

  handleContinueAsGuest = () => {
    this.setState({ continueAsGuest: !this.state.continueAsGuest });
  }

  handleGSTInfo = GSTInfo => {
    this.setState({ GSTInfo });
  }

  updateGSTInfo = reqOBJ => {
    this.setState({ isLoadingTaxInfo: true, taxInfoSuccessMessage: false });
    var reqURL = "api/v1/cart/updatetaxinfo";

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response.items.length > 0) {
          let defaultPaymentMode = Object.keys(
            data.response.paymentGatewayCharges
          )[0];
          let response = data.response;
          response.items = response.items.filter(x => x.isBookable);
          this.setState({
            cart: response,
            isRemoveCartLoading: null,
            selectedPaymentMode: defaultPaymentMode,
            isLoadingTaxInfo: false,
            taxInfoSuccessMessage: true
          });
        }
        else this.setState({ isLoadingTaxInfo: false });
      }.bind(this));
  }
}

export default CartBase;
